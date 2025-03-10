import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResetPassword } from './reset-password.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/email/email.service';
import { UsersService } from 'src/users/users.service';
import * as moment from 'moment';
import * as argon2 from 'argon2';

@Injectable()
export class ResetPasswordService {
	constructor(
		@InjectRepository(ResetPassword) private readonly resetPasswordRepository: Repository<ResetPassword>,
		private readonly emailService: EmailService,
		private readonly usersService: UsersService,
	) {}

	async sendResetLink(email: string, newPassword: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) {
			throw new BadRequestException('User does not exist');
		}

		const rawEntity = this.resetPasswordRepository.create({ expiresAt: moment().add(1, 'day'), newPassword, user });
		const createdEntity = await this.resetPasswordRepository.save(rawEntity);
		return this.emailService.sendResetPassword(user.email, createdEntity.token);
	}

	async reset(token: string) {
		const resetPasswordLink = await this.resetPasswordRepository.findOne({
			where: { token },
			relations: { user: true },
		});
		if (!resetPasswordLink) {
			throw new BadRequestException('Invalid token');
		}

		if (moment(resetPasswordLink.expiresAt).isBefore(moment())) {
			throw new BadRequestException('Token expires');
		}

		const user = resetPasswordLink.user;
		const hashedPassword = await this.hashData(resetPasswordLink.newPassword);
		await this.usersService.update(user.id, { password: hashedPassword });
		return this.resetPasswordRepository.delete(resetPasswordLink);
	}

	private hashData(data: string) {
		return argon2.hash(data);
	}
}
