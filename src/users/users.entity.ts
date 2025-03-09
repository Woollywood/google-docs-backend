import { ApiProperty } from '@nestjs/swagger';
import { Session } from 'src/sessions/sessions.entities';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn({ type: 'bigint' })
	id: number;

	@ApiProperty({ example: 'John' })
	@Column()
	name: string;

	@ApiProperty({ example: 'john' })
	@Column({ unique: true })
	username: string;

	@ApiProperty({ example: 'changeme' })
	@Column()
	password: string;

	@ApiProperty({ type: [Session] })
	@OneToMany(() => Session, (session) => session.user)
	sessions?: Session[];
}
