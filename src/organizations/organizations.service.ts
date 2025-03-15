import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationDto } from './dto/organization.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class OrganizationsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly caslAbilityFactory: CaslAbilityFactory,
	) {}

	findById(id: string) {
		return this.prisma.organization.findUnique({ where: { id } });
	}

	async getCurrent(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { activeOrganization: true },
		});

		if (!user) {
			throw new BadRequestException();
		}

		return user.activeOrganization;
	}

	async getMy(userId: string) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { memberOf: true },
		});
		return user?.memberOf;
	}

	join(userId: string, id: string) {
		return this.prisma.user.update({ where: { id: userId }, data: { activeOrganization: { connect: { id } } } });
	}

	async leave(userId: string) {
		return this.prisma.user.update({ where: { id: userId }, data: { activeOrganizationId: null } });
	}

	create(userId: string, dto: CreateOrganizationDto) {
		return this.prisma.organization.create({
			data: { ...dto, owner: { connect: { id: userId } }, members: { connect: { id: userId } } },
		});
	}

	async delete(userId: string, id: string) {
		const organization = await this.findById(id);
		if (!organization) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Delete, plainToInstance(OrganizationDto, organization))) {
			return this.prisma.organization.delete({ where: { id } });
		} else {
			throw new ForbiddenException();
		}
	}

	async addMember(username: string, id: string) {
		return this.prisma.organization.update({ where: { id }, data: { members: { connect: { username } } } });
	}

	async kickMember(username: string, id: string) {
		return this.prisma.organization.update({ where: { id }, data: { members: { delete: { username } } } });
	}
}
