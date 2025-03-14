import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DocumentsService {
	constructor(
		@InjectRepository(Document) private readonly documentsRepository: Repository<Document>,
		private readonly caslAbilityFactory: CaslAbilityFactory,
		private readonly usersService: UsersService,
	) {}

	async getAllByUserId(userId: string, pageOptionsDto: PageOptionsDto, title: string): Promise<PageDto<Document>> {
		const { skip, order, take } = pageOptionsDto;
		const [entities, itemCount] = await this.documentsRepository.findAndCount({
			where: [
				{
					user: { id: userId },
					title: ILike(`%${title}%`),
				},
				{
					title: ILike(`%${title}%`),
					organization: {
						members: { id: userId },
					},
				},
			],
			skip,
			order: { createdAt: order },
			take,
			relations: { organization: true },
		});

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
		return new PageDto(entities, pageMetaDto);
	}

	async getDocumentById(userId: string, id: string) {
		const document = await this.documentsRepository.findOne({ where: { id }, relations: { user: true } });
		if (!document) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Read, document)) {
			return this.documentsRepository.findOne({ where: { id } });
		} else {
			throw new ForbiddenException();
		}
	}

	async createDocument(userId: string, dto: CreateDocumentDto) {
		const user = await this.usersService.findById(userId, { currentOrganization: true });
		if (!user) {
			throw new BadRequestException();
		}

		let createdDocument: Document | null = null;
		if (user.currentOrganization) {
			createdDocument = this.documentsRepository.create({
				...dto,
				user: { id: userId },
				organization: { id: user?.currentOrganization.id },
			});
		} else {
			createdDocument = this.documentsRepository.create({
				...dto,
				user: { id: userId },
			});
		}

		return this.documentsRepository.save(createdDocument);
	}

	async delete(userId: string, id: string) {
		const document = await this.documentsRepository.findOne({
			where: { id },
			relations: { user: true, organization: true },
		});
		if (!document) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);

		if (ability.can(Actions.Delete, document)) {
			return this.documentsRepository.delete(id);
		} else {
			throw new ForbiddenException();
		}
	}

	async update(userId: string, id: string, dto: UpdateDocumentDto) {
		const document = await this.documentsRepository.findOne({ where: { id }, relations: { user: true } });
		if (!document) {
			throw new BadRequestException();
		}

		const ability = await this.caslAbilityFactory.createForUser(userId);
		if (ability.can(Actions.Delete, document)) {
			return this.documentsRepository.update(id, dto);
		} else {
			throw new ForbiddenException();
		}
	}
}
