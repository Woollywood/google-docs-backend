export interface JwtPayload {
	sub: string;
	username: string;
}

export interface JwtAccessTokenPayload extends JwtPayload {
	accessToken: string;
}

export interface JwtRefreshTokenPayload extends JwtPayload {
	refreshToken: string;
}
