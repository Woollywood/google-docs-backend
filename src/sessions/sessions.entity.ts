import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from 'src/common/common.entity';
import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Session extends AbstractEntity {
	@ApiProperty()
	@Column()
	accessToken: string;

	@ApiProperty()
	@Column()
	refreshToken: string;

	@ApiProperty({ type: () => User })
	@ManyToOne(() => User, (user) => user.sessions)
	user: User;
}
