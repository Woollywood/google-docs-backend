import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DocumentAbilityFactory } from './document-ability.factory';
import { LiveblocksModule } from 'src/liveblocks/liveblocks.module';

@Module({
	imports: [UsersModule, PrismaModule, LiveblocksModule],
	controllers: [DocumentsController],
	providers: [DocumentsService, DocumentAbilityFactory],
	exports: [DocumentsService],
})
export class DocumentsModule {}
