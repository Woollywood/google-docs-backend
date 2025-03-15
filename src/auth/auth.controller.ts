import { Controller, Post, Body, UseGuards, HttpCode, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AccessTokenGuard } from './accessToken.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AccessToken, User } from './auth.decorator';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { AuthTokensDto, TokenDto, RefreshDto, ResetPasswordLinkDto } from './dto/tokens.dto';
import { JwtDto } from './dto/auth.dto';
import { ResetPasswordService } from 'src/reset-password/reset-password.service';
import { SessionDto } from 'src/sessions/dto/session.dto';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/dto/user.dto';

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly emailVerificationService: EmailVerificationService,
		private readonly resetPasswordService: ResetPasswordService,
		private readonly usersService: UsersService,
	) {}

	@ApiResponse({ status: 201, type: AuthTokensDto })
	@Post('sign-up')
	signUp(@Body() dto: CreateUserDto) {
		return this.authService.signUp(dto);
	}

	@ApiResponse({ status: 201, type: AuthTokensDto })
	@Post('sign-in')
	signIn(@Body() dto: CreateUserDto) {
		return this.authService.signIn(dto);
	}

	@ApiResponse({ status: 200, type: SessionDto })
	@ApiBearerAuth()
	@UseGuards(AccessTokenGuard)
	@HttpCode(204)
	@Post('sign-out')
	signOut(@User() { sub }: JwtDto, @AccessToken() accessToken: string) {
		return this.authService.signOut(sub, accessToken);
	}

	@ApiResponse({ status: 201, type: AuthTokensDto })
	@Post('refresh')
	refresh(@Body() { refreshToken }: RefreshDto) {
		return this.authService.refreshTokens({ refreshToken });
	}

	@Post('verify-email')
	verifyEmail(@Body() { token }: TokenDto) {
		return this.emailVerificationService.verify(token);
	}

	@Post('reset-password-link')
	resetPasswordLink(@Body() { email, newPassword }: ResetPasswordLinkDto) {
		return this.resetPasswordService.sendResetLink(email, newPassword);
	}

	@Post('reset-password')
	resetPassword(@Body() { token }: TokenDto) {
		return this.resetPasswordService.reset(token);
	}

	@ApiResponse({ status: 200, type: UserDto })
	@UseGuards(AccessTokenGuard)
	@ApiBearerAuth()
	@Get('identity')
	identity(@User() { sub }: JwtDto) {
		return this.usersService.findById(sub);
	}
}
