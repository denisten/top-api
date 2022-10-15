import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageModel } from './top-page.model';
import { ConfigService } from '@nestjs/config';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { PAGE_NOT_FOUND_ERROR } from './top-page.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(
		private readonly configService: ConfigService,
		private readonly topPageService: TopPageService,
	) {}

	@UseGuards(JwtAuthGuard)
	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.getById(id);
		if (!page) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedPage = await this.topPageService.deleteById(id);
		if (!deletedPage) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
	}

	@Get('by-alias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.getByAlias(alias);
		if (!page) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(
		@Param('id', IdValidationPipe) id: string,
		@Body() dto: TopPageModel,
	) {
		const updatedPage = await this.topPageService.updateById(id, dto);
		if (!updatedPage) {
			throw new NotFoundException(PAGE_NOT_FOUND_ERROR);
		}
		return updatedPage;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find-by-top-level-category')
	async find(@Body() dto: FindTopPageDto) {
		const pages = await this.topPageService.findByTopLevelCategory(
			dto.firstCategory,
		);
		return pages;
	}

	@HttpCode(200)
	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string) {
		return this.topPageService.findByText(text);
	}
}
