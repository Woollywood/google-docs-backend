import { PageDto } from 'src/common/dto/page.dto';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users.entity';

export class PaginatedUserModel extends PageDto<User> {
	@ApiProperty({ type: [User] })
	declare data: User[];
}
