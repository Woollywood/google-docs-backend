import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from 'src/common/common.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';
import { Document } from 'src/documents/documents.entity';

@Entity()
export class Organization extends AbstractEntity {
	@ApiProperty()
	@Column()
	title: string;

	@ApiProperty({ type: () => User })
	@ManyToOne(() => User)
	@JoinColumn()
	owner: User;

	@ApiProperty({ type: () => [User] })
	@OneToMany(() => User, (user) => user.currentOrganization)
	@JoinColumn()
	activeUsers?: User[];

	@ApiProperty({ type: () => [User] })
	@ManyToMany(() => User, (user) => user.organizations)
	@JoinColumn()
	members?: User[];

	@ApiProperty({ type: [Document] })
	@OneToMany(() => Document, (document) => document.organization)
	documents?: Document[];
}
