import { ApiProperty } from '@nestjs/swagger';
import { Organization } from '@prisma/client';
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class OrganizationDto implements Organization {
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
	@IsUUID()
	ownerId: string;
}
