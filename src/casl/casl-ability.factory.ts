import { AbilityBuilder, AbilityTuple, MatchConditions, PureAbility } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Document } from 'src/documents/documents.entity';
import { Organization } from 'src/organizations/organizations.entity';
import { UsersService } from 'src/users/users.service';

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
	constructor(private readonly usersService: UsersService) {}

	async createForUser(userId: string) {
		const user = await this.usersService.findById(userId, { organizations: { members: true } });

		if (!user) {
			throw new BadRequestException();
		}

		const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

		const { id, organizations } = user;

		can(Actions.Create, Document);
		can(Actions.Read, Document);
		can(
			Actions.Update,
			Document,
			({ user, organization }) =>
				user.id === id || (organization && organizations?.some((item) => item.id !== organization.id)) || false,
		);
		can(
			Actions.Delete,
			Document,
			({ user, organization }) =>
				user.id === id || (organization && organizations?.some((item) => item.id !== organization.id)) || false,
		);

		can(Actions.Create, Organization);
		can(Actions.Read, Organization);
		can(Actions.Update, Organization, ({ owner }) => owner.id === id);
		can(Actions.Delete, Organization, ({ owner }) => owner.id === id);

		return build({
			conditionsMatcher: lambdaMatcher,
		});
	}
}
