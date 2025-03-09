import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { JwtDto } from './dto/tokens.dto';
import { Request } from 'express';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
		private readonly sessionsService: SessionsService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get<string>('JWT_ACCESS_SECRET')!,
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtDto): Promise<JwtDto> {
		const user = await this.usersService.findById(+payload.sub);
		if (!user) {
			throw new UnauthorizedException();
		}

		const accessToken = req.get('Authorization')?.replace('Bearer', '').trim() || '';
		const session = await this.sessionsService.findByIdAndAccessToken(user.id, accessToken);
		if (!session) {
			throw new UnauthorizedException();
		}

		return payload;
	}
}
