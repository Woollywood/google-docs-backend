import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Organization } from './organizations.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrganizationsService {
	constructor(
		@InjectRepository(Organization) private readonly organizationsRepository: Repository<Organization>,
		private readonly caslAbilityFactory: CaslAbilityFactory,
		private readonly usersService: UsersService,
	) {}

	findById(id: string) {
		return this.organizationsRepository.findOne({ where: { id } });
	}

	async getCurrent(userId: string) {
		const user = await this.usersService.findById(userId, { currentOrganization: true });

		if (!user) {
			throw new BadRequestException();
		}

		return user.currentOrganization;
	}

	async getMy(userId: string) {
		return this.organizationsRepository.find({
			where: { members: { id: userId } },
		});
	}

	join(userId: string, id: string) {
		return this.organizationsRepository
			.createQueryBuilder()
			.relation(Organization, 'activeUsers')
			.of(id)
			.add(userId);
	}

	async leave(userId: string) {
		const user = await this.usersService.findById(userId, { currentOrganization: true });
		if (!user) {
			throw new BadRequestException();
		}

		if (!user.currentOrganization) {
			throw new BadRequestException();
		}

		return this.organizationsRepository
			.createQueryBuilder()
			.relation(Organization, 'activeUsers')
			.of(user.currentOrganization.id)
			.remove(userId);
	}

	create(userId: string, dto: CreateOrganizationDto) {
		const createdOrganization = this.organizationsRepository.create({
			...dto,
			owner: { id: userId },
			members: [{ id: userId }],
		});
		return this.organizationsRepository.save(createdOrganization);
	}

	async delete(userId: string, id: string) {
		const organization = await this.findById(id);
		if (!organization) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Delete, organization)) {
			return this.organizationsRepository.delete(id);
		} else {
			throw new ForbiddenException();
		}
	}

	async addMember(username: string, id: string) {
		const user = await this.usersService.findByUsername(username);
		if (!user) {
			throw new NotFoundException();
		}

		return this.organizationsRepository.createQueryBuilder().relation(Organization, 'members').of(id).add(user.id);
	}

	async kickMember(username: string, id: string) {
		const user = await this.usersService.findByUsername(username);
		if (!user) {
			throw new NotFoundException();
		}

		const { id: userId } = user;
		return this.organizationsRepository
			.createQueryBuilder()
			.delete()
			.from('members')
			.where('id = :id', { id })
			.andWhere('id = :userId', { userId })
			.execute();
	}
}
