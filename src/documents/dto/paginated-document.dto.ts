import { PageDto } from 'src/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentDto } from './document.dto';

export class PaginatedDocumentModel extends PageDto<DocumentDto> {
	@ApiProperty({ type: [DocumentDto] })
	declare data: DocumentDto[];
}
