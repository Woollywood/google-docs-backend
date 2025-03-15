import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { CaslModule } from 'src/casl/casl.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
	imports: [CaslModule, UsersModule, PrismaModule],
	controllers: [DocumentsController],
	providers: [DocumentsService],
	exports: [DocumentsService],
})
export class DocumentsModule {}
