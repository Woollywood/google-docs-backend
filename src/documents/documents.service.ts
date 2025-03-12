import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './documents.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';

@Injectable()
export class DocumentsService {
	constructor(@InjectRepository(Document) private readonly documentsRepository: Repository<Document>) {}

	async getAllByUserId(userId: number, pageOptionsDto: PageOptionsDto): Promise<PageDto<Document>> {
		const { skip, order, take } = pageOptionsDto;
		const [entities, itemCount] = await this.documentsRepository.findAndCount({
			where: { user: { id: userId } },
			skip,
			order: { createdAt: order },
			take,
			loadEagerRelations: true,
		});

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
		return new PageDto(entities, pageMetaDto);
	}

	createDocument(userId: number, dto: CreateDocumentDto) {
		const createdDocument = this.documentsRepository.create({ ...dto, user: { id: userId } });
		return this.documentsRepository.save(createdDocument);
	}
}
