import { IsEmail, IsString, MinLength } from 'class-validator';

export class JwtDto {
	@IsString()
	sub: string;

	@IsString()
	@MinLength(3)
	username: string;

	@IsEmail()
	email: string;
}
