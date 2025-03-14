import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/common.entity';
import { Document } from 'src/documents/documents.entity';
import { Organization } from 'src/organizations/organizations.entity';
import { Session } from 'src/sessions/sessions.entity';
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class User extends AbstractEntity {
	@ApiProperty({ example: 'john', minLength: 3 })
	@Column({ unique: true })
	username: string;

	@ApiProperty({ example: 'example@example.com' })
	@Column({ unique: true })
	email: string;

	@ApiProperty({ example: false })
	@Column({ default: false })
	emailVerified: boolean;

	@ApiProperty({ example: 'changeme', minLength: 6 })
	@Column()
	password: string;

	@ApiProperty({ type: [Session] })
	@OneToMany(() => Session, (session) => session.user)
	sessions?: Session[];

	@ApiProperty({ type: [Document] })
	@OneToMany(() => Document, (document) => document.user)
	documents?: Document[];

	@ApiProperty({ type: () => [Organization] })
	@ManyToMany(() => Organization, (organization) => organization.members)
	@JoinTable()
	organizations?: Organization[];

	@ApiProperty({ type: () => Organization })
	@ManyToOne(() => Organization, (organization) => organization.activeUsers)
	@JoinColumn()
	currentOrganization: Organization;

	@ApiProperty({ type: () => [Organization] })
	@OneToMany(() => Organization, (organization) => organization.owner)
	@JoinColumn()
	ownedOrganizations?: Organization[];
}
