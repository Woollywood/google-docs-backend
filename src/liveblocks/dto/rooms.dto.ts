import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, IsUUID } from 'class-validator';

export class IdentifyUserDto {
	@ApiProperty()
	@IsString()
	token: string;
}

export class RoomDto {
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

	@ApiProperty({ type: 'string' })
	@IsUUID()
	documentId: string | null;
}
