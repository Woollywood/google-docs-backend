import { Controller, Post, Body, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { JwtDto, RefreshTokenDto, TokensDto } from './dto/tokens.dto';
import { ApiResponse } from '@nestjs/swagger';
import { AccessToken, User } from './auth.decorator';

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
	signIn(@Body() dto: CreateUserDto) {
		return this.authService.signIn(dto);
	}

	@ApiResponse({ status: 200 })
	@UseGuards(AccessTokenGuard)
	@HttpCode(204)
	@Post('sign-out')
	signOut(@User() { sub }: JwtDto, @AccessToken() accessToken: string) {
		return this.authService.signOut(+sub, accessToken);
	}

	@ApiResponse({ status: 201, type: TokensDto })
	@Post('refresh')
	refresh(@Body() { refreshToken }: RefreshTokenDto) {
		return this.authService.refreshTokens({ refreshToken });
	}
}
