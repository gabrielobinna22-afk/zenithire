import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../common/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AccessTokenPayload, AuthTokens, RequestUser } from './types/auth.types';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly mail: MailService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      // Deliberately vague — confirming an email exists to an anonymous
      // caller is a minor account-enumeration leak.
      throw new ConflictException('Unable to register with these details');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    const emailVerifyToken = crypto.randomBytes(32).toString('hex');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        role: dto.role,
        emailVerifyToken,
        // Candidate/employer profile creation is handled by their own
        // modules (CandidateProfile / Company), triggered off this event
        // or an immediately-following "complete profile" call — keeping
        // auth focused only on the account/credential concern.
      },
    });

    await this.mail.sendVerificationEmail(user.email, emailVerifyToken);

    return { id: user.id, email: user.email, role: user.role };
  }

  async login(dto: LoginDto): Promise<AuthTokens & { user: RequestUser }> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status === 'SUSPENDED' || user.status === 'BANNED') {
      throw new UnauthorizedException('This account has been restricted');
    }

    const requestUser: RequestUser = { id: user.id, email: user.email, role: user.role };
    const tokens = await this.issueTokenPair(requestUser);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return { ...tokens, user: requestUser };
  }

  // Called after JwtRefreshGuard + JwtRefreshStrategy have already verified
  // the token's signature, expiry, and that it matches the stored hash.
  async refresh(user: RequestUser): Promise<AuthTokens> {
    return this.issueTokenPair(user);
  }

  async logout(userId: string) {
    // Clearing the hash invalidates every outstanding refresh token for
    // this user immediately.
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash: null },
    });
  }

  async verifyEmail(token: string) {
    const user = await this.prisma.user.findUnique({ where: { emailVerifyToken: token } });
    if (!user) {
      throw new BadRequestException('Invalid or expired verification link');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerifyToken: null,
        status: 'ACTIVE',
      },
    });

    return { verified: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Always return success-shaped response whether or not the account
    // exists, so this endpoint can't be used to enumerate registered
    // emails. The email is only actually sent if the user is real.
    if (!user) {
      return { message: 'If that email is registered, a reset link has been sent' };
    }

    const passwordResetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetExpiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken, passwordResetExpiresAt },
    });

    await this.mail.sendPasswordResetEmail(user.email, passwordResetToken);

    return { message: 'If that email is registered, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { passwordResetToken: dto.token },
    });

    if (!user || !user.passwordResetExpiresAt || user.passwordResetExpiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset link');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
        // Force re-login everywhere after a password reset.
        refreshTokenHash: null,
      },
    });

    return { message: 'Password updated' };
  }

  // --- internals ---------------------------------------------------------

  private async issueTokenPair(user: RequestUser): Promise<AuthTokens> {
    const payload: AccessTokenPayload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = await this.jwt.signAsync(
      { sub: user.id },
      {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    // Store only the hash, never the raw refresh token — mirrors how we
    // treat passwords. Rotation happens implicitly: each call here
    // overwrites the previous hash, so a previously issued refresh token
    // stops matching as soon as a newer one is issued.
    const refreshTokenHash = await bcrypt.hash(refreshToken, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash },
    });

    return { accessToken, refreshToken };
  }
}
