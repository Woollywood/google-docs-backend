import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class AbstractEntity {
	@ApiProperty({ type: 'number' })
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@ApiProperty()
	@CreateDateColumn()
	createdAt: Date;

	@ApiProperty()
	@UpdateDateColumn()
	updatedAt: Date;
}
