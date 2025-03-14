import { Controller, DefaultValuePipe, Get, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User as UserEntity } from './users.entity';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/auth.dto';
import { PaginatedUserModel } from './dto/paginated-user.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@ApiResponse({ status: 200, type: UserEntity })
	@Get('/me')
	getMe(@User() { sub }: JwtDto) {
		return this.usersService.findById(sub);
	}

	@ApiResponse({ status: 200, type: PaginatedUserModel })
	@Get('my')
	getUsers(
		@User() { sub }: JwtDto,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		return this.usersService.findAll(sub, pageOptionsDto, search);
	}
}
