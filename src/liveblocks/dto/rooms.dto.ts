import { IUserInfo } from '@liveblocks/node';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

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

export class ResolvedUsersDto implements Pick<IUserInfo, 'name' | 'avatar'> {
	@ApiProperty({ type: 'string', required: false })
	@IsString()
	@IsOptional()
	name?: string;

	@ApiProperty({ type: 'string', required: false })
	@IsString()
	@IsOptional()
	avatar?: string;
}
