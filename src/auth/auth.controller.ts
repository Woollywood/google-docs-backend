import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { JwtAccessTokenUser } from './decorators/auth.decorator';
import { JwtAccessTokenPayload } from './auth.interfaces';
import { RefreshTokenDto } from './dto/tokens.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-up')
	signUp(@Body() dto: CreateUserDto) {
		return this.authService.signUp(dto);
	}

	@Post('sign-in')
	signIn(@Body() dto: AuthDto) {
		return this.authService.signIn(dto);
	}

	@UseGuards(AccessTokenGuard)
	@HttpCode(204)
	@Post('sign-out')
	signOut(@JwtAccessTokenUser() payload: JwtAccessTokenPayload) {
		return this.authService.signOut(payload);
	}

	@Post('refresh')
	refresh(@Body() { refreshToken }: RefreshTokenDto) {
		return this.authService.refreshTokens({ refreshToken });
	}
}
