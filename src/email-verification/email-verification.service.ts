import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EmailVerificationService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly emailService: EmailService,
		private readonly usersService: UsersService,
	) {}

	findByUserId(userId: string) {
		return this.prisma.emailVerification.findUnique({ where: { userId } });
	}

	deleteById(id: string) {
		return this.prisma.emailVerification.delete({ where: { id } });
	}

	async sendVerificationLink(userId: string) {
		const createdEntity = await this.prisma.emailVerification.create({
			data: { expiresAt: moment().add(1, 'day').toDate(), user: { connect: { id: userId } } },
			include: { user: true },
		});
		return this.emailService.sendVerificationEmail(createdEntity.user.email, createdEntity.token);
	}

	async verify(token: string) {
		const verificationLink = await this.prisma.emailVerification.findUnique({
			where: { token },
			include: { user: true },
		});

		if (!verificationLink) {
			throw new BadRequestException('Invalid token');
		}

		if (moment(verificationLink.expiresAt).isBefore(moment())) {
			throw new BadRequestException('Token expires');
		}

		const user = verificationLink.user;
		await this.usersService.update(user.id, { emailVerified: true });
		return this.prisma.emailVerification.delete({ where: { id: verificationLink.id } });
	}
}
