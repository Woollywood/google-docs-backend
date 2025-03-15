// import { AbstractEntity } from 'src/common/common.entity';
// import { User } from 'src/users/users.entity';
// import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

// @Entity()
// export class EmailVerification extends AbstractEntity {
// 	@Column()
// 	expiresAt: Date;

// 	@Column({ unique: true, generated: 'uuid' })
// 	token: string;

// 	@OneToOne(() => User)
// 	@JoinColumn()
// 	user: User;
// }
