import { PageDto } from 'src/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class PaginatedUserModel extends PageDto<UserDto> {
	@ApiProperty({ type: [UserDto] })
	declare data: UserDto[];
}
