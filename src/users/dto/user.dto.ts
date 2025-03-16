import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { IsBoolean, IsDateString, IsEmail, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class UserDto implements Omit<User, 'password'> {
	@ApiProperty()
	@IsUUID()
	id: string;

	@ApiProperty({ type: Date })
	@IsDateString()
	createdAt: Date;

	@ApiProperty({ type: Date })
	@IsDateString()
	updatedAt: Date;

	@ApiProperty({ minLength: 3 })
	@IsString()
	@MinLength(3)
	username: string;

	@ApiProperty()
	@IsEmail()
	email: string;

	@ApiProperty()
	@IsBoolean()
	emailVerified: boolean;

	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	@IsOptional()
	activeOrganizationId: string | null;
}
