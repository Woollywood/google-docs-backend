import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class RefreshDto {
	@ApiProperty()
	@IsString()
	refreshToken: string;
}

export class TokenDto {
	@ApiProperty()
	@IsUUID()
	token: string;
}

export class ResetPasswordLinkDto {
	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsString()
	@MinLength(6)
	newPassword: string;
}

export class AuthTokensDto {
	@ApiProperty()
	@IsString()
	accessToken: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;
}
