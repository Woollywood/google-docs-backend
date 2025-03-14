import { PageDto } from 'src/common/dto/page.dto';
import { Document } from '../documents.entity';
import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDocumentModel extends PageDto<Document> {
	@ApiProperty({ type: [Document] })
	declare data: Document[];
}
