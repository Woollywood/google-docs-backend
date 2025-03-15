import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DocumentDto } from './dto/document.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class DocumentsService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly caslAbilityFactory: CaslAbilityFactory,
	) {}

	async getAllByUserId(userId: string, pageOptionsDto: PageOptionsDto, title: string) {
		const { skip, order, take } = pageOptionsDto;
		const [entities, itemCount] = await Promise.all([
			this.prisma.document.findMany({
				where: {
					title: { contains: title, mode: 'insensitive' },
					OR: [{ user: { id: userId } }, { organization: { members: { some: { id: userId } } } }],
				},
				skip,
				orderBy: { createdAt: order },
				take,
			}),
			this.prisma.document.count({
				where: {
					title: { contains: title, mode: 'insensitive' },
					OR: [{ user: { id: userId } }, { organization: { members: { some: { id: userId } } } }],
				},
			}),
		]);

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
		return new PageDto(entities, pageMetaDto);
	}

	async getDocumentById(userId: string, id: string) {
		const document = await this.prisma.document.findUnique({ where: { id }, include: { user: true } });
		if (!document) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Read, plainToInstance(DocumentDto, document))) {
			return this.prisma.document.findUnique({ where: { id } });
		} else {
			throw new ForbiddenException();
		}
	}

	async createDocument(userId: string, dto: CreateDocumentDto) {
		const user = await this.prisma.user.findUnique({
			where: { id: userId },
			include: { activeOrganization: true },
		});
		if (!user) {
			throw new BadRequestException();
		}

		if (user.activeOrganization) {
			return this.prisma.document.create({ data: { ...dto, userId, organizationId: user.activeOrganizationId } });
		} else {
			return this.prisma.document.create({ data: { ...dto, userId } });
		}
	}

	async delete(userId: string, id: string) {
		const document = await this.prisma.document.findUnique({
			where: { id },
			include: { user: true, organization: true },
		});
		if (!document) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);

		if (ability.can(Actions.Delete, plainToInstance(DocumentDto, document))) {
			return this.prisma.document.delete({ where: { id } });
		} else {
			throw new ForbiddenException();
		}
	}

	async update(userId: string, id: string, dto: UpdateDocumentDto) {
		const document = await this.prisma.document.findUnique({
			where: { id },
			include: { user: true },
		});
		if (!document) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Delete, plainToInstance(DocumentDto, document))) {
			return this.prisma.document.update({ where: { id }, data: dto });
		} else {
			throw new ForbiddenException();
		}
	}
}
