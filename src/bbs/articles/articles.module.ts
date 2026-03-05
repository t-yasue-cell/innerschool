import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PicturesService } from '../pictures/pictures.service';
import { CategorysService } from '../categorys/categorys.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService, PicturesService, CategorysService],
})
export class ArticlesModule {}
