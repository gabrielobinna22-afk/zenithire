import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { RefreshTokenPayload, RequestUser } from '../types/auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      // Refresh token is sent in the request body, not a header, since the
      // client stores it more like a credential than a per-request token.
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  // The signature/expiry check happens automatically before this runs.
  // Here we additionally confirm the presented token matches the single
  // hash we have on file for this user — so a refresh token that was
  // already rotated out (e.g. stolen and reused after the legitimate
  // client refreshed) is rejected even though it's still "validly signed".
  async validate(req: Request, payload: RefreshTokenPayload): Promise<RequestUser> {
    const presentedToken = req.body?.refreshToken;
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

    if (!user || !user.refreshTokenHash || !presentedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const matches = await bcrypt.compare(presentedToken, user.refreshTokenHash);
    if (!matches) {
      // Signals possible token theft/reuse — worth logging/alerting on
      // in a real deployment (see AuditLog in the schema).
      throw new UnauthorizedException('Refresh token has been rotated or revoked');
    }

    return { id: user.id, email: user.email, role: user.role };
  }
}
