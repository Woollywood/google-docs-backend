import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { EmailVerificationService } from 'src/email-verification/email-verification.service';
import { AuthTokensDto, RefreshDto } from './dto/tokens.dto';
import { JwtDto } from './dto/auth.dto';
import * as argon2 from 'argon2';
import { UserDto } from 'src/users/dto/user.dto';

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
		const isUsernameExists = await this.usersService.findByUsername(dto.username);
		if (isUsernameExists) {
			throw new BadRequestException('This username is already taken');
		}

		const isEmailExists = await this.usersService.findByEmail(dto.email);
		if (isEmailExists) {
			throw new BadRequestException('This email is already taken');
		}

		const hashedPassword = await this.hashData(dto.password);
		const newUser = await this.usersService.create({ ...dto, password: hashedPassword });
		const tokens = await this.getTokens(this.dbUserToJwtPayload(newUser));
		const { accessToken, refreshToken } = tokens;
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens({ accessToken, refreshToken });
		await this.sessionsService.create({
			userId: newUser.id,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		await this.emailVerificationService.sendVerificationLink(newUser.id);
		return tokens;
	}

	async signIn(dto: CreateUserDto) {
		const user = await this.usersService.findByCredentials(dto);
		if (!user) {
			throw new BadRequestException('Invalid username or email');
		}

		const passwordMatches = await argon2.verify(user.password, dto.password);
		if (!passwordMatches) {
			throw new BadRequestException('Password is incorrect');
		}

		if (!user.emailVerified) {
			const emailVerificationLink = await this.emailVerificationService.findByUserId(user.id);
			if (emailVerificationLink) {
				await this.emailVerificationService.deleteById(emailVerificationLink.id);
			}
			await this.emailVerificationService.sendVerificationLink(user.id);
			throw new BadRequestException('Email not confirmed. Check your email for a verification link');
		}

		const tokens = await this.getTokens(this.dbUserToJwtPayload(user));
		const { accessToken, refreshToken } = tokens;
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens({ accessToken, refreshToken });
		await this.sessionsService.create({
			userId: user.id,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		return tokens;
	}

	async signOut(userId: string, accessToken: string) {
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

			const dbUser = await this.usersService.findById(user.sub);
			if (!dbUser?.emailVerified) {
				throw new UnauthorizedException();
			}

			const session = await this.sessionsService.findByIdAndRefreshToken(user.sub, refreshToken);

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

	private dbUserToJwtPayload(user: UserDto): JwtDto {
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
				expiresIn: '30m',
			}),
			this.jwtService.signAsync(payload, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
				expiresIn: '7d',
			}),
		]);
		return { accessToken, refreshToken };
	}
}
