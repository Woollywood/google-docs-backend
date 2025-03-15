import { ApiProperty } from '@nestjs/swagger';
import { ResetPassword } from '@prisma/client';
import { IsDateString, IsString, IsUUID, MinLength } from 'class-validator';

export class ResetPasswordDto implements ResetPassword {
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
	@IsDateString()
	expiresAt: Date;

	@ApiProperty()
	@IsString()
	token: string;

	@ApiProperty({ minLength: 6 })
	@IsString()
	@MinLength(6)
	newPassword: string;

	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	userId: string;
}
