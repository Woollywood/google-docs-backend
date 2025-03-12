import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'john', minLength: 3 })
	@IsString()
	@MinLength(3)
	username: string;

	@ApiProperty({ example: 'example@example.com' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'changeme', minLength: 6 })
	@IsString()
	@MinLength(6)
	password: string;
}

export class OmittedUserDto extends OmitType(CreateUserDto, ['password']) {}
