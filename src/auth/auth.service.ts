import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { User } from 'src/users/users.entity';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import * as argon2 from 'argon2';
import { AuthTokensDto, RefreshDto } from './dto/tokes.dto';
import { JwtDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly sessionsService: SessionsService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
		private readonly emailVerificationService: EmailVerificationService,
	) {}

	async signUp(dto: CreateUserDto) {
		const isUserExists = await this.usersService.findByUsername(dto.username);
		if (isUserExists) {
			throw new BadRequestException('User already exists');
		}

		const hashedPassword = await this.hashData(dto.password);
		const newUser = await this.usersService.create({ ...dto, password: hashedPassword });
		const tokens = await this.getTokens(this.dbUserToJwtPayload(newUser));
		const { accessToken, refreshToken } = tokens;
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens({ accessToken, refreshToken });
		await this.sessionsService.create({
			user: newUser,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		await this.emailVerificationService.sendVerificationLink(newUser);
		return tokens;
	}

	async signIn(dto: CreateUserDto) {
		const user = await this.usersService.findByUsername(dto.username);
		if (!user) {
			throw new BadRequestException('User does not exist');
		}

		const passwordMatches = await argon2.verify(user.password, dto.password);
		if (!passwordMatches) {
			throw new BadRequestException('Password is incorrect');
		}

		if (!user.emailVerified) {
			throw new BadRequestException('Email not confirmed');
		}

		const tokens = await this.getTokens(this.dbUserToJwtPayload(user));
		const { accessToken, refreshToken } = tokens;
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens({ accessToken, refreshToken });
		await this.sessionsService.create({
			user,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		return tokens;
	}

	async signOut(userId: number, accessToken: string) {
		const session = await this.sessionsService.findByIdAndAccessToken(userId, accessToken);
		if (!session) {
			throw new BadRequestException('Session not found');
		}
		return this.sessionsService.remove(session.id);
	}

	async refreshTokens({ refreshToken }: RefreshDto) {
		try {
			const user = this.jwtService.verify<JwtDto>(refreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			});

			const session = await this.sessionsService.findByIdAndRefreshToken(+user.sub, refreshToken);

			if (!session) {
				throw new UnauthorizedException();
			}

			const tokens = await this.getTokens({ email: user.email, sub: user.sub, username: user.username });
			const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens(tokens);
			await this.sessionsService.update(session?.id, {
				accessToken: hashedAccessToken,
				refreshToken: hashedRefreshToken,
			});
			return tokens;
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException();
			}
		}
	}

	private hashData(data: string) {
		return argon2.hash(data);
	}

	private dbUserToJwtPayload(user: User): JwtDto {
		return { sub: String(user.id), email: user.email, username: user.username };
	}

	private async getHashedTokens(dto: AuthTokensDto) {
		const { accessToken, refreshToken } = dto;
		const [hashedAccessToken, hashedRefreshToken] = await Promise.all([
			this.hashData(accessToken),
			this.hashData(refreshToken),
		]);
		return { hashedAccessToken, hashedRefreshToken };
	}

	private async getTokens(payload: JwtDto) {
		const [accessToken, refreshToken] = await Promise.all([
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
				expiresIn: '15m',
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
				expiresIn: '7d',
			}),
		]);
		return { accessToken, refreshToken };
	}
}
