import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Session } from './sessions.entity';
import { Repository } from 'typeorm';
import { CreateSessionDto } from './dto/createSession.dto';
import { UpdateSessionDto } from './dto/updateSession.dto';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { RefreshDto } from 'src/auth/dto/tokens.dto';

@Injectable()
export class SessionsService {
	constructor(
		@InjectRepository(Session) private readonly sessionRepository: Repository<Session>,
		private readonly usersService: UsersService,
	) {}

	findById(id: string) {
		return this.sessionRepository.findOneBy({ id });
	}

	async findByIdAndTokens(userId: string, accessToken: string, refreshToken: string) {
		const user = await this.usersService.findById(userId, { sessions: true });
		if (!user) {
			return null;
		}

		if (!user.sessions) {
			return null;
		}

		for (const session of user.sessions) {
			const isVerified = await Promise.all([
				argon2.verify(session.accessToken, accessToken),
				argon2.verify(session.refreshToken, refreshToken),
			]);
			if (isVerified.every(Boolean)) {
				return this.sessionRepository.findOneBy({
					id: session.id,
					accessToken: session.accessToken,
					refreshToken: session.refreshToken,
				});
			}
		}

		return null;
	}

	async findByIdAndRefreshToken(userId: string, refreshToken: string) {
		const user = await this.usersService.findById(userId, { sessions: true });
		if (!user) {
			return null;
		}

		if (!user.sessions) {
			return null;
		}

		for (const session of user.sessions) {
			const isVerified = await argon2.verify(session.refreshToken, refreshToken);
			if (isVerified) {
				return this.sessionRepository.findOneBy({ id: session.id, refreshToken: session.refreshToken });
			}
		}

		return null;
	}

	async findByIdAndAccessToken(userId: string, accessToken: string) {
		const user = await this.usersService.findById(userId, { sessions: true });
		if (!user) {
			return null;
		}

		if (!user.sessions) {
			return null;
		}

		for (const session of user.sessions) {
			const isVerified = await argon2.verify(session.accessToken, accessToken);
			if (isVerified) {
				return this.sessionRepository.findOneBy({ id: session.id, accessToken: session.accessToken });
			}
		}

		return null;
	}

	async findByRefreshToken({ refreshToken }: RefreshDto) {
		return this.sessionRepository.findOneBy({ refreshToken });
	}

	create(dto: CreateSessionDto) {
		const createdSession = this.sessionRepository.create(dto);
		return this.sessionRepository.save(createdSession);
	}

	update(sessionId: string, dto: UpdateSessionDto) {
		return this.sessionRepository.update(sessionId, dto);
	}

	remove(sessionId: string) {
		return this.sessionRepository.delete(sessionId);
	}
}
