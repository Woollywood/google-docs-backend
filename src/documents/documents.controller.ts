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
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { PaginatedDocumentModel } from './dto/paginated-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentDto } from './dto/document.dto';

@ApiBearerAuth()
@UseGuards(AccessTokenGuard)
@Controller('documents')
@UseInterceptors(ClassSerializerInterceptor)
export class DocumentsController {
	constructor(private readonly documentsService: DocumentsService) {}

	@ApiResponse({ status: 200, type: PaginatedDocumentModel })
	@Get('my')
	getMyDocuments(
		@User() { sub }: JwtDto,
		@Query() pageOptionsDto: PageOptionsDto,
		@Query('search', new DefaultValuePipe('')) search: string,
	) {
		return this.documentsService.getAllByUserId(sub, pageOptionsDto, search);
	}

	@ApiResponse({ status: 201, type: DocumentDto })
	@Post('create')
	createDocument(@User() { sub }: JwtDto, @Body() dto: CreateDocumentDto) {
		return this.documentsService.createDocument(sub, dto);
	}

	@ApiResponse({ status: 200, type: DocumentDto })
	@Get(':id')
	getDocument(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.documentsService.getDocumentById(sub, id);
	}

	@ApiResponse({ type: DocumentDto })
	@Delete(':id')
	delete(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string) {
		return this.documentsService.delete(sub, id);
	}

	@ApiResponse({ type: DocumentDto })
	@Patch(':id')
	path(@User() { sub }: JwtDto, @Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateDocumentDto) {
		return this.documentsService.update(sub, id, dto);
	}
}
