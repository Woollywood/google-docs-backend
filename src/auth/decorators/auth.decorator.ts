import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from '../auth.interfaces';

export const JwtAccessTokenUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): JwtAccessTokenPayload => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user as JwtAccessTokenPayload;
	},
);

export const JwtRefreshTokenUser = createParamDecorator(
	(data: unknown, ctx: ExecutionContext): JwtRefreshTokenPayload => {
		const request = ctx.switchToHttp().getRequest<Request>();
		return request.user as JwtRefreshTokenPayload;
	},
);
