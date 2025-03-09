import { IsString, ValidateNested } from 'class-validator';
import { User } from 'src/users/users.entity';

export class CreateSessionDto {
	@IsString()
	accessToken: string;

	@IsString()
	refreshToken: string;

	@ValidateNested()
	user: User;
}
