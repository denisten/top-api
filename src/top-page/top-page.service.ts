import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
	constructor(
		@InjectModel(TopPageModel)
		private readonly topPageModel: ModelType<TopPageModel>,
	) {}

	async create(dto: CreateTopPageDto) {
		return this.topPageModel.create(dto);
	}

	async getById(id: string) {
		return this.topPageModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}

	async getByAlias(alias: string) {
		return this.topPageModel.findOne({ alias }).exec();
	}

	async updateById(id: string, dto: CreateTopPageDto) {
		return this.topPageModel.findByIdAndUpdate(id, dto, { new: true });
	}

	async findByTopLevelCategory(firstCategory: TopLevelCategory) {
		return this.topPageModel
			.aggregate()
			.match({
				firstCategory,
			})
			.group({
				_id: { secondCategory: '$secondCategory' },
				pages: { $push: { alias: '$alias', title: '$title' } },
			})
			.exec();
	}

	async findByText(text: string) {
		return this.topPageModel
			.find({ $text: { $search: text, $caseSensitive: false } })
			.exec();
	}
}
