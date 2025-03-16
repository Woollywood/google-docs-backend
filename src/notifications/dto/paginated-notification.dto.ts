import { PageDto } from 'src/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationDto } from './notification.dto';

export class PaginatedNotificationModel extends PageDto<NotificationDto> {
	@ApiProperty({ type: [NotificationDto] })
	declare data: NotificationDto[];
}
