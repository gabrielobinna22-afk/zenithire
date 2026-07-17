import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { AccessTokenPayload, RequestUser } from '../types/auth.types';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  // Runs on every authenticated request. We re-check status here (not just
  // signature/expiry) so a suspended or banned account is locked out
  // immediately, even if they're holding a still-valid access token.
  async validate(payload: AccessTokenPayload): Promise<RequestUser> {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || user.status === 'SUSPENDED' || user.status === 'BANNED') {
      throw new UnauthorizedException('Account is not active');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
