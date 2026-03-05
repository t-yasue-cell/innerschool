import { Module } from '@nestjs/common';
import { BbsController } from './bbs.controller';
import { BbsService } from './bbs.service';
import { ArticlesModule } from './articles/articles.module';
import { CategorysModule } from './categorys/categorys.module';
import { PicturesModule } from './pictures/pictures.module';
import { ArticlesService } from './articles/articles.service';
import { CategorysService } from './categorys/categorys.service';

@Module({
    imports: [ArticlesModule, CategorysModule, PicturesModule],
    controllers: [BbsController],
    providers: [BbsService, ArticlesService, CategorysService]
})
export class BbsModule {}
