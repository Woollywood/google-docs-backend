import { IsString, IsUUID } from 'class-validator';

export class CreateSessionDto {
	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;

	@IsUUID()
	userId: string;
}
