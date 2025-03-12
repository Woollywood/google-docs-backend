import { IsEmail, IsString, IsUUID, MinLength } from 'class-validator';

export class JwtDto {
	@IsUUID()
	sub: string;

	@IsString()
	@MinLength(3)
	username: string;

	@IsEmail()
	email: string;
}
