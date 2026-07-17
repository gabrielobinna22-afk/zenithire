import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { MailService } from '../common/mail/mail.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    // No default secret/expiry configured here — each signAsync call in
    // AuthService passes its own secret (access vs refresh) explicitly,
    // since they're different keys with different lifetimes.
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}
