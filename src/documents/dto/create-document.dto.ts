import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
	@ApiProperty({ example: 'blank', minLength: 3, required: true })
	@IsString()
	title: string;

	@ApiProperty({ nullable: true, required: false })
	@IsString()
	@IsOptional()
	content?: string;
}
