import { PartialType } from '@nestjs/mapped-types';
import { CreateSessionDto } from './createSession.dto';

export class UpdateSessionDto extends PartialType(CreateSessionDto) {}
