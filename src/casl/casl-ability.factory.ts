import { AbilityBuilder, AbilityTuple, MatchConditions, PureAbility } from '@casl/ability';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Document } from 'src/documents/documents.entity';
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
		const user = await this.usersService.findById(userId);
		if (!user) {
			throw new BadRequestException();
		}

		const { can, build } = new AbilityBuilder<AppAbility>(PureAbility);

		const { id } = user;

		can(Actions.Create, Document);
		can(Actions.Read, Document);
		can(Actions.Update, Document, ({ user }) => user.id === id);
		can(Actions.Delete, Document, ({ user }) => user.id === id);

		return build({
			conditionsMatcher: lambdaMatcher,
		});
	}
}
