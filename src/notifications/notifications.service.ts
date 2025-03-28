import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PageMetaDto } from 'src/common/dto/pageMeta.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAllByRecipientId(recipientId: string, pageOptionsDto: PageOptionsDto) {
		const { skip, order, take } = pageOptionsDto;
		const [entities, itemCount] = await Promise.all([
			this.prisma.notification.findMany({
				where: {
					recipientId,
				},
				skip,
				orderBy: { createdAt: order },
				take,
				include: { organization: true, sender: true },
			}),
			this.prisma.notification.count({
				where: {
					recipientId,
				},
			}),
		]);

		const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
		return new PageDto(entities, pageMetaDto);
	}

	send(dto: CreateNotificationDto) {
		return this.prisma.notification.create({ data: dto });
	}

	deleteByToken(token: string) {
		return this.prisma.notification.delete({ where: { token } });
	}
}
