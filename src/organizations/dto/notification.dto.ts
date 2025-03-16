import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';

export class CreateOrganizationNotificationDto extends PickType(CreateNotificationDto, [
	'type',
	'senderId',
	'recipientId',
	'organizationId',
]) {
	@ApiProperty()
	@IsUUID()
	organizationId: string;
}

export class SendOrganizationNotificationDto extends PickType(CreateNotificationDto, [
	'recipientId',
	'organizationId',
]) {
	@ApiProperty()
	@IsUUID()
	organizationId: string;
}

export class AcceptOrganizationInvitationDto extends PickType(CreateNotificationDto, ['organizationId']) {
	@ApiProperty()
	@IsUUID()
	token: string;

	@ApiProperty()
	@IsUUID()
	organizationId: string;
}

export class RejectOrganizationInvitationDto {
	@ApiProperty()
	@IsUUID()
	token: string;
}
