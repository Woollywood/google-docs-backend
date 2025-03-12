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
	Patch,
	DefaultValuePipe,
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
import { UpdateDocumentDto } from './dto/update-document.dto';

@UseGuards(AccessTokenGuard)
@Controller('documents')
@UseInterceptors(ClassSerializerInterceptor)
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}

	@ApiResponse({ status: 200, type: PaginatedModel })
	@Get('my')
	getMyDocuments(
		@User() { sub }: JwtDto,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		return this.documentsService.getAllByUserId(sub, pageOptionsDto, search);
	}

	@ApiResponse({ status: 201, type: Document })
	@Post()
	createDocument(@User() { sub }: JwtDto, @Body() dto: CreateDocumentDto) {
		return this.documentsService.createDocument(sub, dto);
	}

	@ApiResponse({ status: 200, type: Document })
	@Get(':id')
	getDocument(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.documentsService.getDocumentById(sub, id);
	}

	@Delete(':id')
	delete(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.documentsService.delete(sub, id);
	}

	@Patch(':id')
	path(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDocumentDto) {
		return this.documentsService.update(sub, id, dto);
	}
}
