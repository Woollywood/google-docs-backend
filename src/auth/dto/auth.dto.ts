import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
	@ApiProperty({ example: 'john' })
	@IsString()
	username: string;

	@ApiProperty({ example: 'changeme' })
	@IsString()
	password: string;
}
