import { PartialType } from '@nestjs/swagger';
import { CreateSessionDto } from './createSession.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
