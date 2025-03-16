import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentAbilityFactory } from './document-ability.factory';

@Module({
	imports: [UsersModule, PrismaModule],
	controllers: [DocumentsController],
	providers: [DocumentsService, DocumentAbilityFactory],
	exports: [DocumentsService],
})
export class DocumentsModule {}
