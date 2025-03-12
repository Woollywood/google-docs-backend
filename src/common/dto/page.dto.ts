import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetaDto } from './pageMeta.dto';
import { AbstractEntity } from '../common.entity';

export class PageDto<T extends AbstractEntity> {
	@IsArray()
	@ApiProperty({ isArray: true })
	readonly data: T[];

	@ApiProperty({ type: () => PageMetaDto })
	readonly meta: PageMetaDto;

	constructor(data: T[], meta: PageMetaDto) {
		this.data = data;
		this.meta = meta;
	}
}
