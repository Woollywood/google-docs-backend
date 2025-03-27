import { IUserInfo, Liveblocks } from '@liveblocks/node';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RoomParams } from './liveblocks.types';
import { PrismaService } from 'src/prisma/prisma.service';
import { Actions, LiveblocksAbilityFactory } from './liveblocks-ability.factory';
import { plainToInstance } from 'class-transformer';
import { RoomDto } from './dto/rooms.dto';

@Injectable()
export class LiveblocksService {
	private liveblocks: Liveblocks = null as unknown as Liveblocks;

	constructor(
		private readonly configService: ConfigService,
		private readonly prisma: PrismaService,
		private readonly liveblocksAbilityFactory: LiveblocksAbilityFactory,
	) {
		this.liveblocks = new Liveblocks({
			secret: configService.get<string>('LIVEBLOCKS_SECRET_KEY')!,
		});
	}

	async identifyUser(userId: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { memberOf: true } });
		if (!user) {
			throw new BadRequestException();
		}

		const { username: name, memberOf } = user;
		const groupIds = memberOf.map(({ id }) => id);
		const { body, error } = await this.liveblocks.identifyUser(
			{
				userId,
				groupIds,
			},
			{ userInfo: { name } },
		);
		if (error) {
			throw new BadRequestException(error.message);
		}
		return body;
	}

	async createRoomForDocument(documentId: string, roomId: string, params: RoomParams) {
		const room = await this.liveblocks.createRoom(roomId, params);
		await this.prisma.room.create({ data: { id: room.id, document: { connect: { id: documentId } } } });
		return room;
	}

	updateRoom(roomId: string, params: RoomParams) {
		return this.liveblocks.updateRoom(roomId, params);
	}

	async deleteRoom(roomId: string) {
		await this.prisma.room.delete({ where: { id: roomId } });
		return this.liveblocks.deleteRoom(roomId);
	}

	async resolveUsers(userIds: string[]): Promise<IUserInfo[]> {
		const allUsers = await this.prisma.user.findMany({ where: { id: { in: userIds } } });
		const mappedData: IUserInfo[] = allUsers.map(({ username }) => ({ name: username }));
		return mappedData;
	}

	async getMentionSuggestions(roomId: string, text: string) {
		const { data } = await this.liveblocks.getActiveUsers(roomId);
		const mappedData = data.filter(({ info }) => info?.name?.includes(text)).map(({ id }) => id);
		return mappedData;
	}

	async getRoomByDocumentId(userId: string, documentId: string) {
		const room = await this.prisma.room.findUnique({ where: { documentId } });
		if (!room) {
			throw new BadRequestException();
		}

		const ability = await this.liveblocksAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Read, plainToInstance(RoomDto, room))) {
			return room;
		} else {
			throw new ForbiddenException();
		}
	}

	async enterRoom(roomId: string, userId: string) {
		const room = await this.prisma.room.findUnique({ where: { id: roomId } });
		if (!room) {
			throw new BadRequestException();
		}

		const ability = await this.liveblocksAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Enter, plainToInstance(RoomDto, room))) {
			return room;
		} else {
			throw new ForbiddenException();
		}
	}
}
