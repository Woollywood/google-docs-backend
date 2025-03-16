import { AbilityBuilder, AbilityTuple, MatchConditions, PureAbility } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentDto } from 'src/documents/dto/document.dto';
import { PrismaService } from 'src/prisma/prisma.service';

export enum Actions {
	Manage = 'manage',
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
}

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class DocumentAbilityFactory {
	constructor(private readonly prisma: PrismaService) {}

	async createForUser(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { memberOf: { include: { members: true } }, ownedOrganizations: true },
		});

		if (!user) {
			throw new BadRequestException();
		}

		const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

		const { id, memberOf, ownedOrganizations } = user;

		can(Actions.Create, DocumentDto);
		can(
			Actions.Read,
			DocumentDto,
			({ userId, organizationId }) =>
				userId === id || memberOf.some((organization) => organization.id === organizationId),
		);
		can(
			Actions.Update,
			DocumentDto,
			({ userId, organizationId }) => userId === id || memberOf?.some((item) => item.id !== organizationId),
		);
		can(
			Actions.Delete,
			DocumentDto,
			({ userId, organizationId }) => userId === id || ownedOrganizations.some(({ id }) => id === organizationId),
		);

		return build({
			conditionsMatcher: lambdaMatcher,
		});
	}
}
