import { ApiProperty } from '@nestjs/swagger';
import { Session } from 'src/sessions/sessions.entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

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
}
