import { AbilityBuilder, AbilityTuple, MatchConditions, PureAbility } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationDto } from './dto/organization.dto';

export enum Actions {
	Manage = 'manage',
	Create = 'create',
	Read = 'read',
	Update = 'update',
	Delete = 'delete',
	INVITE = 'invite',
	KICK = 'kick',
}

type AppAbility = PureAbility<AbilityTuple, MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class OrganizationsAbilityFactory {
	constructor(private readonly prisma: PrismaService) {}

	async createForUser(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { memberOf: true, ownedOrganizations: true },
		});

		if (!user) {
			throw new BadRequestException();
		}

		const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

		const { memberOf, ownedOrganizations } = user;
		can(Actions.Create, OrganizationDto);
		can(Actions.Read, OrganizationDto, ({ id }) => memberOf.some((organization) => organization.id === id));
		can(Actions.Update, OrganizationDto, ({ id }) =>
			ownedOrganizations.some((organization) => organization.id === id),
		);
		can(Actions.Delete, OrganizationDto, ({ id }) =>
			ownedOrganizations.some((organization) => organization.id === id),
		);
		can(Actions.INVITE, OrganizationDto, ({ id }) => memberOf.some((organization) => organization.id === id));
		can(Actions.KICK, OrganizationDto, ({ id }) =>
			ownedOrganizations.some((organization) => organization.id === id),
		);

		return build({
			conditionsMatcher: lambdaMatcher,
		});
	}
}
