import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class ToggleOrganizationDto {
	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	@IsOptional()
	id: string | null;
}
