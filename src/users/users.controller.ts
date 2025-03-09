import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './users.entity';
import { JwtAccessTokenUser } from 'src/auth/decorators/auth.decorator';
import { JwtAccessTokenPayload } from 'src/auth/auth.interfaces';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiResponse({ status: 200, type: User })
	@Get('/me')
	getMe(@JwtAccessTokenUser() { sub }: JwtAccessTokenPayload) {
		return this.usersService.findById(+sub);
	}
}
