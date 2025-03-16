import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';
import { PageDto } from 'src/common/dto/page.dto';
import { UserDto } from 'src/users/dto/user.dto';

export class KickMemberDto {
	@ApiProperty()
	@IsUUID()
	organizationId: string;

	@ApiProperty()
	@IsUUID()
	userId: string;
}

export class MemberDto extends UserDto {
	@ApiProperty()
	@IsBoolean()
	isMember: boolean;

	@ApiProperty()
	@IsBoolean()
	isInvitationSended: boolean;
}

export class PaginatedMembersModel extends PageDto<MemberDto> {
	@ApiProperty({ type: [MemberDto] })
	declare data: MemberDto[];
}
