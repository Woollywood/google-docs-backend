import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { OrganizationsService } from './organizations.service';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/auth.dto';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './dto/members.dto';
import { OrganizationDto } from './dto/organization.dto';

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

	@Post('join/:id')
	join(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.organizationsService.join(sub, id);
	}

	@Post('leave')
	leave(@User() { sub }: JwtDto) {
		return this.organizationsService.leave(sub);
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

	@ApiResponse({ status: 201, type: OrganizationDto })
	@Post('members')
	addMember(@Body() { id, username }: MemberDto) {
		return this.organizationsService.addMember(username, id);
	}

	@ApiResponse({ type: OrganizationDto })
	@Delete('members')
	kickMember(@Body() { id, username }: MemberDto) {
		return this.organizationsService.kickMember(username, id);
	}
}
