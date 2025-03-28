import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';
import { IsEnum, IsUUID } from 'class-validator';
import { NotificationTypeDto } from './notification-type.dto';

export class CreateNotificationDto extends OmitType(PartialType(NotificationDto), ['organization', 'sender']) {
	@ApiProperty({ type: NotificationDto })
	@IsEnum(NotificationDto)
	type: NotificationTypeDto;

	@ApiProperty()
	@IsUUID()
	recipientId: string;

	@ApiProperty()
	@IsUUID()
	senderId: string;
}
