import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Delete,
	Get,
	Param,
	ParseUUIDPipe,
	Post,
	Query,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { AccessTokenGuard } from 'src/auth/accessToken.guard';
import { User } from 'src/auth/auth.decorator';
import { JwtDto } from 'src/auth/dto/auth.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ApiResponse } from '@nestjs/swagger';
import { Document } from './documents.entity';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PaginatedModel } from './dto/paginated-document.dto';

@UseGuards(AccessTokenGuard)
@Controller('documents')
@UseInterceptors(ClassSerializerInterceptor)
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}

	@ApiResponse({ status: 200, type: PaginatedModel })
	@Get('my')
	getMyDocument(@User() { sub }: JwtDto, @Query() pageOptionsDto: PageOptionsDto) {
		return this.documentsService.getAllByUserId(sub, pageOptionsDto);
	}

	@ApiResponse({ status: 201, type: Document })
	@Post()
	createDocument(@User() { sub }: JwtDto, @Body() dto: CreateDocumentDto) {
		return this.documentsService.createDocument(sub, dto);
	}

	@Delete(':id')
	delete(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.documentsService.delete(sub, id);
	}
}
