import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { JwtAccessTokenUser } from './decorators/auth.decorator';
import { JwtAccessTokenPayload } from './auth.interfaces';
import { RefreshTokenDto, TokensDto } from './dto/tokens.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiResponse({ status: 201, type: TokensDto })
	@Post('sign-up')
	signUp(@Body() dto: CreateUserDto) {
		return this.authService.signUp(dto);
	}

	@ApiResponse({ status: 201, type: TokensDto })
	@Post('sign-in')
	signIn(@Body() dto: AuthDto) {
		return this.authService.signIn(dto);
	}

	@ApiResponse({ status: 200 })
	@UseGuards(AccessTokenGuard)
	@HttpCode(204)
	@Post('sign-out')
	signOut(@JwtAccessTokenUser() payload: JwtAccessTokenPayload) {
		return this.authService.signOut(payload);
	}

	@ApiResponse({ status: 201, type: TokensDto })
	@Post('refresh')
	refresh(@Body() { refreshToken }: RefreshTokenDto) {
		return this.authService.refreshTokens({ refreshToken });
	}
}
