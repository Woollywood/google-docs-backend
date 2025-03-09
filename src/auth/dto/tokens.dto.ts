import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class TokensDto {
	@ApiProperty()
	@IsString()
	accessToken: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;
}

export class JwtDto {
	@IsString()
	sub: string;

	@IsString()
	@MinLength(3)
	username: string;

	@IsEmail()
	email: string;
}

export class RefreshTokenDto {
	@ApiProperty()
	@IsString()
	refreshToken: string;
}
