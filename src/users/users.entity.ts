import { Session } from 'src/sessions/sessions.entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@Column()
	name: string;

	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@OneToMany(() => Session, (session) => session.user)
	sessions?: Session[];
}
