import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
	@ApiProperty({ example: 'John' })
	@IsString()
	name: string;

	@ApiProperty({ example: 'john' })
	@IsString()
	username: string;

	@ApiProperty({ example: 'changeme' })
	@IsString()
	password: string;
}
