import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/createSession.dto';
import { UpdateSessionDto } from './dto/updateSession.dto';
import * as argon2 from 'argon2';
import { RefreshDto } from 'src/auth/dto/tokens.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SessionsService {
	constructor(private readonly prisma: PrismaService) {}

	async findByIdAndTokens(userId: string, accessToken: string, refreshToken: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { sessions: true } });
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
				return this.prisma.session.findUnique({
					where: { id: session.id, accessToken: session.accessToken, refreshToken: session.refreshToken },
				});
			}
		}

		return null;
	}

	async findByIdAndRefreshToken(userId: string, refreshToken: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { sessions: true } });
		if (!user) {
			return null;
		}

		if (!user.sessions) {
			return null;
		}

		for (const session of user.sessions) {
			const isVerified = await argon2.verify(session.refreshToken, refreshToken);
			if (isVerified) {
				return this.prisma.session.findUnique({
					where: { id: session.id, refreshToken: session.refreshToken },
				});
			}
		}

		return null;
	}

	async findByIdAndAccessToken(userId: string, accessToken: string) {
		const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { sessions: true } });
		if (!user) {
			return null;
		}

		if (!user.sessions) {
			return null;
		}

		for (const session of user.sessions) {
			const isVerified = await argon2.verify(session.accessToken, accessToken);
			if (isVerified) {
				return this.prisma.session.findUnique({ where: { id: session.id, accessToken: session.accessToken } });
			}
		}

		return null;
	}

	async findByRefreshToken({ refreshToken }: RefreshDto) {
		return this.prisma.session.findUnique({ where: { refreshToken } });
	}

	create(dto: CreateSessionDto) {
		return this.prisma.session.create({ data: dto });
	}

	update(sessionId: string, dto: UpdateSessionDto) {
		return this.prisma.session.update({ where: { id: sessionId }, data: dto });
	}

	remove(sessionId: string) {
		return this.prisma.session.delete({ where: { id: sessionId } });
	}
}
