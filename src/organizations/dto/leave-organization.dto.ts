import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class LeaveOrganizationDto {
	@ApiProperty()
	@IsUUID()
	id: string;
}
