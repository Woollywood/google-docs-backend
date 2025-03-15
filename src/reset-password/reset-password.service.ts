import { BadRequestException, Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';
import * as argon2 from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResetPasswordService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly emailService: EmailService,
		private readonly usersService: UsersService,
	) {}

	findByUserId(userId: string) {
		return this.prisma.resetPassword.findUnique({ where: { userId } });
	}

	deleteById(id: string) {
		return this.prisma.resetPassword.delete({ where: { id } });
	}

	async sendResetLink(email: string, newPassword: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) {
			throw new BadRequestException('User does not exist');
		}

		const existingLink = await this.findByUserId(user.id);
		if (existingLink) {
			await this.deleteById(existingLink.id);
		}

		const hashedNewPassword = await this.hashData(newPassword);
		const createdEntity = await this.prisma.resetPassword.create({
			data: {
				expiresAt: moment().add(1, 'day').toDate(),
				newPassword: hashedNewPassword,
				user: { connect: { id: user.id } },
			},
		});
		return this.emailService.sendResetPassword(user.email, createdEntity.token);
	}

	async reset(token: string) {
		const resetPasswordLink = await this.prisma.resetPassword.findUnique({
			where: { token },
			include: { user: true },
		});
		if (!resetPasswordLink) {
			throw new BadRequestException('Invalid token');
		}

		if (moment(resetPasswordLink.expiresAt).isBefore(moment())) {
			throw new BadRequestException('Token expires');
		}

		const user = resetPasswordLink.user;
		await this.usersService.update(user.id, { password: resetPasswordLink.newPassword });
		return this.prisma.resetPassword.delete({ where: { id: resetPasswordLink.id } });
	}

	private hashData(data: string) {
		return argon2.hash(data);
	}
}
