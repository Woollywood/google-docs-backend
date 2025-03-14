import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class MemberDto {
	@ApiProperty({ description: 'organization id' })
	@IsString()
	id: string;

	@ApiProperty()
	@IsString()
	@MinLength(3)
	username: string;
}
