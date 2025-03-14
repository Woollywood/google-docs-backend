import { Injectable } from '@nestjs/common';
import { CreateUserDto, OmittedUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { FindOptionsRelations, ILike, Not, Repository } from 'typeorm';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

	async create(dto: CreateUserDto) {
		const createdUser = this.usersRepository.create(dto);
		return await this.usersRepository.save(createdUser);
	}

	async findAll(userId: string, pageOptionsDto: PageOptionsDto, username: string): Promise<PageDto<User>> {
		const { skip, order, take } = pageOptionsDto;
		const [entities, itemCount] = await this.usersRepository.findAndCount({
			where: {
				id: Not(userId),
				username: ILike(`%${username}%`),
			},
			skip,
			order: { createdAt: order },
			take,
		});

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
		return new PageDto(entities, pageMetaDto);
	}

	findById(id: string, relations?: FindOptionsRelations<User>) {
		return this.usersRepository.findOne({ where: { id }, relations });
	}

	findByUsername(username: string, relations?: FindOptionsRelations<User>) {
		return this.usersRepository.findOne({ where: { username }, relations });
	}

	findByEmail(email: string, relations?: FindOptionsRelations<User>) {
		return this.usersRepository.findOne({ where: { email }, relations });
	}

	findByCredentials({ email, username }: OmittedUserDto) {
		return this.usersRepository.findOne({ where: { email, username } });
	}

	update(id: string, dto: UpdateUserDto) {
		return this.usersRepository.update(id, dto);
	}

	delete(id: string) {
		return this.usersRepository.delete(id);
	}
}
