import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateOrganizationDto {
	@ApiProperty()
	@IsString()
	@MinLength(3)
	title: string;
}
