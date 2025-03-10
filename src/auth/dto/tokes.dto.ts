import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class RefreshDto {
	@ApiProperty()
	@IsString()
	refreshToken: string;
}

export class EmailVerificationDto {
	@ApiProperty()
	@IsUUID()
	token: string;
}

export class AuthTokensDto {
	@ApiProperty()
	@IsString()
	accessToken: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;
}
