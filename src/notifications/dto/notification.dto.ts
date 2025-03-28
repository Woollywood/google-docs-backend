import { ApiProperty } from '@nestjs/swagger';
import { Notification } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsUUID, ValidateNested } from 'class-validator';
import { NotificationTypeDto } from './notification-type.dto';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class NotificationDto implements Notification {
	@ApiProperty()
	@IsUUID()
	id: string;

	@ApiProperty()
	@IsDateString()
	createdAt: Date;

	@ApiProperty()
	@IsDateString()
	updatedAt: Date;

	@ApiProperty({ type: NotificationDto })
	@IsEnum(NotificationDto)
	type: NotificationTypeDto;

	@ApiProperty()
	@IsUUID()
	token: string;

	@ApiProperty()
	@IsUUID()
	recipientId: string;

	@ApiProperty()
	@IsUUID()
	senderId: string;

	@ApiProperty({ type: UserDto })
	@ValidateNested()
	sender: UserDto;

	@ApiProperty({ type: 'string', nullable: true })
	@IsUUID()
	@IsOptional()
	organizationId: string | null;

	@ApiProperty({ type: OrganizationDto })
	@ValidateNested()
	organization: OrganizationDto;
}
