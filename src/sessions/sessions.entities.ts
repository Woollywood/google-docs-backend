import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@Column()
	accessToken?: string;

	@Column()
	refreshToken?: string;

	@ManyToOne(() => User, (user) => user.sessions)
	user: User;
}
