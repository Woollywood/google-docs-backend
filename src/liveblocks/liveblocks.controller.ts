import { Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { LiveblocksService } from './liveblocks.service';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/auth.dto';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { IdentifyUserDto, RoomDto } from './dto/rooms.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('liveblocks')
export class LiveblocksController {
	constructor(private readonly liveblocksService: LiveblocksService) {}

	@ApiResponse({ status: 201, type: IdentifyUserDto })
	@Post('rooms/identify')
	identifyUser(@User() { sub }: JwtDto) {
		return this.liveblocksService.identifyUser(sub);
	}

	@ApiResponse({ status: 200, type: RoomDto })
	@Get('rooms/:documentId')
	getRoomByDocumentId(@User() { sub }: JwtDto, @Param('documentId', ParseUUIDPipe) documentId: string) {
		return this.liveblocksService.getRoomByDocumentId(sub, documentId);
	}

	@ApiResponse({ status: 200, type: RoomDto })
	@Post('rooms/enter/:id')
	enterRoom(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.liveblocksService.enterRoom(id, sub);
	}
}
