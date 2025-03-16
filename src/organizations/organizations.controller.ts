import {
	Body,
	Controller,
	DefaultValuePipe,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { OrganizationsService } from './organizations.service';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/auth.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrganizationDto } from './dto/organization.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import {
	AcceptOrganizationInvitationDto,
	RejectOrganizationInvitationDto,
	SendOrganizationNotificationDto,
} from './dto/notification.dto';
import { NotificationDto } from 'src/notifications/dto/notification.dto';
import { KickMemberDto, PaginatedMembersModel } from './dto/members.dto';
import { ToggleOrganizationDto } from './dto/toggle-organization.dto';
import { LeaveOrganizationDto } from './dto/leave-organization.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('organizations')
export class OrganizationsController {
	constructor(private readonly organizationsService: OrganizationsService) {}

	@ApiResponse({ status: 200, type: [OrganizationDto] })
	@Get('my')
	getMy(@User() { sub }: JwtDto) {
		return this.organizationsService.getMy(sub);
	}

	@ApiResponse({ status: 200, type: OrganizationDto })
	@Get('current')
	getCurrent(@User() { sub }: JwtDto) {
		return this.organizationsService.getCurrent(sub);
	}

	@ApiResponse({ status: 200, type: OrganizationDto })
	@Get(':id')
	getOrganizationById(@Param('id', new ParseUUIDPipe()) id: string) {
		return this.organizationsService.findById(id);
	}

	@ApiResponse({ type: OrganizationDto })
	@Post('toggle')
	toggle(@User() { sub }: JwtDto, @Body() { id }: ToggleOrganizationDto) {
		return this.organizationsService.toggle(sub, id);
	}

	@ApiResponse({ type: OrganizationDto })
	@Post('leave')
	leave(@User() { sub }: JwtDto, @Body() { id }: LeaveOrganizationDto) {
		return this.organizationsService.leave(sub, id);
	}

	@ApiResponse({ status: 200, type: OrganizationDto })
	@Post('new')
	create(@User() { sub }: JwtDto, @Body() dto: CreateOrganizationDto) {
		return this.organizationsService.create(sub, dto);
	}

	@ApiResponse({ type: OrganizationDto })
	@Delete(':id')
	delete(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.organizationsService.delete(sub, id);
	}

	@ApiResponse({ status: 200, type: PaginatedMembersModel })
	@Get(':id/members')
	getMembers(
		@User() { sub }: JwtDto,
		@Param('id', ParseUUIDPipe) id: string,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		return this.organizationsService.getMembers(sub, id, pageOptionsDto, search);
	}

	@ApiResponse({ type: NotificationDto })
	@Post('send-invite')
	sendInvite(@User() { sub }: JwtDto, @Body() dto: SendOrganizationNotificationDto) {
		return this.organizationsService.sendInvite({
			...dto,
			senderId: sub,
			type: 'ORGANIZATION_INVITE',
		});
	}

	@Post('kick')
	kickMember(@User() { sub }: JwtDto, @Body() dto: KickMemberDto) {
		return this.organizationsService.kickMember(sub, dto);
	}

	@ApiResponse({ type: NotificationDto })
	@Post('accept-invite')
	acceptInvite(@User() { sub }: JwtDto, @Body() { token, organizationId }: AcceptOrganizationInvitationDto) {
		return this.organizationsService.acceptInvite(sub, token, organizationId);
	}

	@ApiResponse({ type: NotificationDto })
	@Post('reject-invite')
	rejectInvite(@Body() { token }: RejectOrganizationInvitationDto) {
		return this.organizationsService.rejectInvite(token);
	}
}
