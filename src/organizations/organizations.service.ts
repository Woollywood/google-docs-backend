import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrganizationDto } from './dto/organization.dto';
import { plainToInstance } from 'class-transformer';
import { NotificationsService } from 'src/notifications/notifications.service';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { CreateOrganizationNotificationDto } from './dto/notification.dto';
import { KickMemberDto } from './dto/members.dto';
import { Actions, OrganizationsAbilityFactory } from './organizations-ability.factory';

@Injectable()
export class OrganizationsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly organizationsAbilityFactory: OrganizationsAbilityFactory,
		private readonly notificationService: NotificationsService,
	) {}

	findById(id: string) {
		return this.prisma.organization.findUnique({ where: { id }, include: { members: true } });
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

		const ability = await this.organizationsAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Delete, plainToInstance(OrganizationDto, organization))) {
			return this.prisma.organization.delete({ where: { id } });
		} else {
			throw new ForbiddenException();
		}
	}

	async getMembers(userId: string, id: string, pageOptionsDto: PageOptionsDto, search: string) {
		const ability = await this.organizationsAbilityFactory.createForUser(userId);
		const organization = await this.findById(id);
		if (ability.can(Actions.Read, plainToInstance(OrganizationDto, organization))) {
			const { skip, order, take } = pageOptionsDto;
			const [entities, itemCount] = await Promise.all([
				this.prisma.user.findMany({
					where: {
						id,
						memberOf: {
							some: { members: { some: { username: { contains: search, mode: 'insensitive' } } } },
						},
					},
					skip,
					orderBy: { createdAt: order },
					take,
				}),
				this.prisma.user.count({
					where: {
						id,
						memberOf: {
							some: { members: { some: { username: { contains: search, mode: 'insensitive' } } } },
						},
					},
				}),
			]);

			const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
			return new PageDto(entities, pageMetaDto);
		} else {
			throw new ForbiddenException();
		}
	}

	async sendInvite(dto: CreateOrganizationNotificationDto) {
		const { senderId, organizationId, recipientId } = dto;
		const ability = await this.organizationsAbilityFactory.createForUser(senderId);
		const organization = await this.findById(organizationId);

		if (ability.can(Actions.INVITE, plainToInstance(OrganizationDto, organization))) {
			const recipientNotifications = await this.prisma.notification.findMany({ where: { recipientId } });
			if (recipientNotifications.some((notification) => notification.organizationId === organizationId)) {
				throw new BadRequestException();
			}

			if (organization?.members.some((member) => member.id === recipientId)) {
				throw new BadRequestException();
			}

			return this.notificationService.send(dto);
		} else {
			throw new ForbiddenException();
		}
	}

	async kickMember(id: string, { organizationId, userId }: KickMemberDto) {
		const ability = await this.organizationsAbilityFactory.createForUser(id);
		const organization = await this.findById(organizationId);

		if (ability.can(Actions.KICK, plainToInstance(OrganizationDto, organization))) {
			if (!organization?.members.some((member) => member.id === userId)) {
				throw new BadRequestException();
			}

			return this.prisma.organization.update({
				where: { id: organizationId },
				data: { members: { disconnect: { id: userId } } },
			});
		} else {
			throw new ForbiddenException();
		}
	}

	async acceptInvite(userId: string, token: string, organizationId: string) {
		const invitation = await this.prisma.notification.findUnique({ where: { token } });
		if (!invitation) {
			throw new BadRequestException();
		}

		await this.prisma.organization.update({
			where: { id: organizationId },
			data: { members: { connect: { id: userId } } },
		});
		return this.notificationService.deleteByToken(token);
	}

	async rejectInvite(token: string) {
		const invitation = await this.prisma.notification.findUnique({ where: { token } });
		if (!invitation) {
			throw new BadRequestException();
		}

		return this.notificationService.deleteByToken(token);
	}
}
