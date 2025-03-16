import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class KickMemberDto {
	@ApiProperty()
	@IsUUID()
	organizationId: string;

	@ApiProperty()
	@IsUUID()
	userId: string;
}
