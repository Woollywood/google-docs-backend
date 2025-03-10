import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
	constructor(@InjectRepository(User) private readonly usersRepository: Repository<User>) {}

	async create(dto: CreateUserDto) {
		const createdUser = this.usersRepository.create(dto);
		return await this.usersRepository.save(createdUser);
	}

	findAll() {
		return this.usersRepository.find();
	}

	findById(id: number) {
		return this.usersRepository.findOne({ where: { id }, relations: { sessions: true } });
	}

	findByUsername(username: string) {
		return this.usersRepository.findOne({ where: { username }, relations: { sessions: true } });
	}

	findByEmail(email: string) {
		return this.usersRepository.findOne({ where: { email }, relations: { sessions: true } });
	}

	update(id: number, dto: UpdateUserDto) {
		return this.usersRepository.update(id, dto);
	}

	delete(id: number) {
		return this.usersRepository.delete(id);
	}
}
