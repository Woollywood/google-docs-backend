import { ApiProperty } from '@nestjs/swagger';
import { Document } from '@prisma/client';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class DocumentDto implements Document {
	@ApiProperty()
	@IsUUID()
	id: string;

	@ApiProperty()
	@IsDateString()
	createdAt: Date;

	@ApiProperty()
	@IsDateString()
	updatedAt: Date;

	@ApiProperty()
	@IsString()
	title: string;

	@ApiProperty({ type: 'string', nullable: true })
	@IsString()
	@IsOptional()
	content: string | null;

	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	userId: string | null;

	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	organizationId: string | null;
}
