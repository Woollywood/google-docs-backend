import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './accessToken.strategy';
import { UsersModule } from 'src/users/users.module';
import { SessionsModule } from 'src/sessions/sessions.module';

@Module({
	imports: [JwtModule.register({}), UsersModule, SessionsModule],
	controllers: [AuthController],
	providers: [AuthService, AccessTokenStrategy],
})
export class AuthModule {}
