import { AbilityBuilder, AbilityTuple, MatchConditions, PureAbility } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RoomDto } from './dto/rooms.dto';

export enum Actions {
	Manage = 'manage',
	Enter = 'enter',
	Read = 'read',
}

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class LiveblocksAbilityFactory {
	constructor(private readonly prisma: PrismaService) {}

	async createForUser(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { memberOf: { include: { members: true } }, ownedOrganizations: true, document: true },
		});

		if (!user) {
			throw new BadRequestException();
		}

		const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

		const { memberOf, document } = user;

		can(
			Actions.Read,
			RoomDto,
			({ documentId }) =>
				document.some(({ id }) => documentId === id) ||
				memberOf.some(({ members }) => members.some(({ id }) => userId === id)),
		);
		can(
			Actions.Enter,
			RoomDto,
			({ documentId }) =>
				document.some(({ id }) => documentId === id) ||
				memberOf.some(({ members }) => members.some(({ id }) => userId === id)),
		);

		return build({
			conditionsMatcher: lambdaMatcher,
		});
	}
}
