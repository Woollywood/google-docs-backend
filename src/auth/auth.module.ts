import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './accessToken.strategy';
import { UsersModule } from 'src/users/users.module';
import { SessionsModule } from 'src/sessions/sessions.module';
import { EmailVerificationModule } from 'src/email-verification/email-verification.module';
import { ResetPasswordModule } from 'src/reset-password/reset-password.module';

@Module({
	imports: [JwtModule.register({}), UsersModule, SessionsModule, EmailVerificationModule, ResetPasswordModule],
	controllers: [AuthController],
	providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
