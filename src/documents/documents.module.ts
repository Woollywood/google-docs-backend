import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './documents.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Document])],
	controllers: [DocumentsController],
	providers: [DocumentsService],
	exports: [DocumentsService],
})
export class DocumentsModule {}
