// import { ApiProperty } from '@nestjs/swagger';
// import { AbstractEntity } from 'src/common/common.entity';
// import { Organization } from 'src/organizations/organizations.entity';
// import { User } from 'src/users/users.entity';
// import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

// @Entity()
// export class Document extends AbstractEntity {
// 	@ApiProperty({ example: 'blank', minLength: 3 })
// 	@Column()
// 	title: string;

// 	@ApiProperty({ nullable: true })
// 	@Column({ nullable: true })
// 	content?: string;

// 	@ApiProperty({ type: () => User })
// 	@ManyToOne(() => User, (user) => user.documents)
// 	user: User;

// 	@ApiProperty({ type: () => User })
// 	@ManyToOne(() => Organization, (organization) => organization.documents)
// 	@JoinColumn()
// 	organization: Organization;
// }
