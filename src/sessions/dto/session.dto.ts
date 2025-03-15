import { ApiProperty } from '@nestjs/swagger';
import { Session } from '@prisma/client';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class SessionDto implements Session {
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
	accessToken: string;

	@ApiProperty()
	@IsString()
	refreshToken: string;

	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	@IsOptional()
	userId: string | null;
}
