import { AbilityBuilder, AbilityTuple, MatchConditions, PureAbility } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentDto } from 'src/documents/dto/document.dto';
import { OrganizationDto } from 'src/organizations/dto/organization.dto';
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
export class CaslAbilityFactory {
	constructor(private readonly prisma: PrismaService) {}

	async createForUser(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { memberOf: { include: { members: true } } },
		});

		if (!user) {
			throw new BadRequestException();
		}

		const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

		const { id, memberOf } = user;

		can(Actions.Create, DocumentDto);
		can(Actions.Read, DocumentDto);
		can(
			Actions.Update,
			DocumentDto,
			({ userId, organizationId }) =>
				userId === id || (memberOf && memberOf?.some((item) => item.id !== organizationId)) || false,
		);
		can(
			Actions.Delete,
			DocumentDto,
			({ userId, organizationId }) =>
				userId === id || (memberOf && memberOf?.some((item) => item.id !== organizationId)) || false,
		);

		can(Actions.Create, OrganizationDto);
		can(Actions.Read, OrganizationDto);
		can(Actions.Update, OrganizationDto, ({ ownerId }) => ownerId === id);
		can(Actions.Delete, OrganizationDto, ({ ownerId }) => ownerId === id);

		return build({
			conditionsMatcher: lambdaMatcher,
		});
	}
}
