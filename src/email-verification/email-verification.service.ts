import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from 'src/email/email.service';
import { EmailVerification } from './email-verification.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.entity';
import * as moment from 'moment';

@Injectable()
export class EmailVerificationService {
	constructor(
		@InjectRepository(EmailVerification)
		private readonly emailVerificationRepository: Repository<EmailVerification>,
		private readonly emailService: EmailService,
		private readonly usersService: UsersService,
	) {}

	findByUser(user: User) {
		return this.emailVerificationRepository.findOneBy({ user });
	}

	deleteById(id: string) {
		return this.emailVerificationRepository.delete(id);
	}

	async sendVerificationLink(user: User) {
		const rawEntity = this.emailVerificationRepository.create({ expiresAt: moment().add(1, 'day'), user });
		const createdEntity = await this.emailVerificationRepository.save(rawEntity);
		return this.emailService.sendVerificationEmail(user.email, createdEntity.token);
	}

	async verify(token: string) {
		const verificationLink = await this.emailVerificationRepository.findOne({
			where: { token },
			relations: { user: true },
		});

		if (!verificationLink) {
			throw new BadRequestException('Invalid token');
		}

		if (moment(verificationLink.expiresAt).isBefore(moment())) {
			throw new BadRequestException('Token expires');
		}

		const user = verificationLink.user;
		await this.usersService.update(user.id, { emailVerified: true });
		return this.emailVerificationRepository.delete(verificationLink);
	}
}
