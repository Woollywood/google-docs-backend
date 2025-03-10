import { User } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmailVerification {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@Column()
	expiresAt: Date;

	@Column({ unique: true, generated: 'uuid' })
	token: string;

	@OneToOne(() => User)
	@JoinColumn()
	user: User;
}
