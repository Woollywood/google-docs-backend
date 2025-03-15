import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractEntity {
	@ApiProperty({ type: 'string' })
	id: string;

	@ApiProperty()
	createdAt: Date;

	@ApiProperty()
	updatedAt: Date;
}
