import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Session } from './sessions.entities';

@Module({
	imports: [UsersModule, TypeOrmModule.forFeature([Session])],
	providers: [SessionsService],
	exports: [SessionsService],
})
export class SessionsModule {}
