import { Injectable } from '@nestjs/common';
import { CreateUserDto, OmittedUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
	constructor(private readonly prisma: PrismaService) {}

	create(dto: CreateUserDto) {
		return this.prisma.user.create({ data: dto });
	}

	async findAll(userId: string, pageOptionsDto: PageOptionsDto, username: string) {
		const { skip, order, take } = pageOptionsDto;
		const [entities, itemCount] = await Promise.all([
			this.prisma.user.findMany({
				where: { id: { not: userId }, username: { contains: username, mode: 'insensitive' } },
				omit: { activeOrganizationId: true },
				skip,
				orderBy: { createdAt: order },
				take,
			}),
			this.prisma.user.count({
				where: { id: { not: userId }, username: { contains: username, mode: 'insensitive' } },
			}),
		]);

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
		return new PageDto(entities, pageMetaDto);
	}

	findById(id: string) {
		return this.prisma.user.findUnique({ where: { id } });
	}

	findByUsername(username: string) {
		return this.prisma.user.findUnique({ where: { username } });
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } });
	}

	findByCredentials({ email, username }: OmittedUserDto) {
		return this.prisma.user.findUnique({ where: { email, username } });
	}

	update(id: string, dto: UpdateUserDto) {
		return this.prisma.user.update({ where: { id }, data: dto });
	}

	delete(id: string) {
		return this.prisma.user.delete({ where: { id } });
	}
}
