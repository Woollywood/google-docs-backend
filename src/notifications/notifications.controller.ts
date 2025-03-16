import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/auth.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { NotificationsService } from './notifications.service';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PaginatedNotificationModel } from './dto/paginated-notification.dto';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationService: NotificationsService) {}

	@ApiResponse({ status: 200, type: PaginatedNotificationModel })
	@Get()
	getAll(@User() { sub }: JwtDto, @Query() pageOptionsDto: PageOptionsDto) {
		return this.notificationService.getAllByRecipientId(sub, pageOptionsDto);
	}
}
