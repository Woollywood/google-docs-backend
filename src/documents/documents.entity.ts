import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/common.entity';
import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Document extends AbstractEntity {
	@ApiProperty({ example: 'blank', minLength: 3 })
	@Column()
	title: string;

	@ApiProperty({ nullable: true })
	@Column({ nullable: true })
	content?: string;

	@ApiProperty({ type: () => User })
	@ManyToOne(() => User, (user) => user.documents)
	user: User;
}
