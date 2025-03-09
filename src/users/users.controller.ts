import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User as UserEntity } from './users.entity';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/tokens.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiResponse({ status: 200, type: UserEntity })
	@Get('/me')
	getMe(@User() { sub }: JwtDto) {
		console.log(sub);

		return this.usersService.findById(+sub);
	}
}
