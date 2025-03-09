import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthDto } from './dto/auth.dto';
import { SessionsService } from 'src/sessions/sessions.service';
import { RefreshTokenDto, TokensDto } from './dto/tokens.dto';
import { JwtAccessTokenPayload, JwtPayload } from './auth.interfaces';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly sessionsService: SessionsService,
		private readonly jwtService: JwtService,
		private readonly configService: ConfigService,
	) {}

	async signUp(dto: CreateUserDto) {
		const isUserExists = await this.usersService.findByUsername(dto.username);
		if (isUserExists) {
			throw new BadRequestException('User already exists');
		}

		const hashedPassword = await this.hashData(dto.password);
		const newUser = await this.usersService.create({ ...dto, password: hashedPassword });
		const tokens = await this.getTokens(newUser.id, newUser.username);
		const { accessToken, refreshToken } = tokens;
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens({ accessToken, refreshToken });
		await this.sessionsService.create({
			user: newUser,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		return tokens;
	}

	async signIn(dto: AuthDto) {
		const user = await this.usersService.findByUsername(dto.username);
		if (!user) {
			throw new BadRequestException('User does not exist');
		}

		const passwordMatches = await argon2.verify(user.password, dto.password);
		if (!passwordMatches) {
			throw new BadRequestException('Password is incorrect');
		}

		const tokens = await this.getTokens(user.id, user.username);
		const { accessToken, refreshToken } = tokens;
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens({ accessToken, refreshToken });
		await this.sessionsService.create({
			user,
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		return tokens;
	}

	async signOut({ sub, accessToken }: JwtAccessTokenPayload) {
		const session = await this.sessionsService.findByIdAndAccessToken(+sub, accessToken);
		if (!session) {
			throw new BadRequestException('Session not found');
		}
		return this.sessionsService.remove(session.id);
	}

	async refreshTokens({ refreshToken }: RefreshTokenDto) {
		let user: JwtPayload = {} as JwtPayload;
		try {
			user = this.jwtService.verify<JwtPayload>(refreshToken, {
				secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
			});
		} catch (error) {
			if (error instanceof Error) {
				throw new UnauthorizedException();
			}
		}

		const session = await this.sessionsService.findByIdAndRefreshToken(+user.sub, refreshToken);
		if (!session) {
			throw new UnauthorizedException();
		}

		const tokens = await this.getTokens(+user.sub, user.username);
		const { hashedAccessToken, hashedRefreshToken } = await this.getHashedTokens(tokens);
		await this.sessionsService.update(session?.id, {
			accessToken: hashedAccessToken,
			refreshToken: hashedRefreshToken,
		});
		return tokens;
	}

	private hashData(data: string) {
		return argon2.hash(data);
	}

	private async getHashedTokens(dto: TokensDto) {
		const { accessToken, refreshToken } = dto;
		const [hashedAccessToken, hashedRefreshToken] = await Promise.all([
			this.hashData(accessToken),
			this.hashData(refreshToken),
		]);
		return { hashedAccessToken, hashedRefreshToken };
	}

	private async getTokens(userId: number, username: string) {
		const payload: JwtPayload = { sub: String(userId), username };
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
