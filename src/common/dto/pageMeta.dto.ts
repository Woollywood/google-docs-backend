import { ApiProperty } from '@nestjs/swagger';
import { PageMetaDtoParameters } from '../common.interface';

export class PageMetaDto {
	@ApiProperty()
	readonly page: number;

	@ApiProperty()
	readonly take: number;

	@ApiProperty()
	readonly itemCount: number;

	@ApiProperty()
	readonly pageCount: number;

	@ApiProperty()
	readonly hasPreviousPage: boolean;

	@ApiProperty()
	readonly hasNextPage: boolean;

	constructor({ pageOptionsDto: { take = 10, page = 1 }, itemCount }: PageMetaDtoParameters) {
		this.page = page;
		this.take = take;
		this.itemCount = itemCount;
		this.pageCount = Math.ceil(this.itemCount / this.take);
		this.hasPreviousPage = this.page > 1;
		this.hasNextPage = this.page < this.pageCount;
	}
}
