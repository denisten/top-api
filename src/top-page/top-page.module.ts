import { Module } from '@nestjs/common';
import { TopPageController } from './top-page.controller';
import { ConfigModule } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model';
import { TopPageService } from './top-page.service';

@Module({
  controllers: [TopPageController],
  imports: [ConfigModule,
	TypegooseModule.forFeature([
		{
		typegooseClass: TopPageModel,
		schemaOptions: {
			collection: 'TopPage'
		}
		}
	])],
  providers: [TopPageService]
})
export class TopPageModule { }
