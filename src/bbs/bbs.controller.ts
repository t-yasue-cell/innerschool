import { Controller, Render, Get, Post, UseGuards, Res, Req, Query } from '@nestjs/common';
import { BbsService } from './bbs.service';
import { PasswordGuardHard } from 'src/password.guard';
import { ArticlesService } from './articles/articles.service';
import { CreateArticleDto } from './articles/dto/create-article.dto';
import express from 'express';
import { CategorysService } from './categorys/categorys.service';

@Controller('bbs')
export class BbsController {
  constructor(private readonly bbsService: BbsService, 
              private readonly articlesService: ArticlesService,
              private readonly categoryService: CategorysService) {}
  
  @Get("editor")
  @UseGuards(PasswordGuardHard)
  @Render("articleEditor")
  async startpage(@Query('id') id?: string){
    const categorys = await this.categoryService.findAll();
    if(id){
      const article = await this.articlesService.findOne_include(Number(id));
      if(article){
        return {
          id: id,
          title : article.title,
          author: article.author,
          bodyHTML: article.bodyHTML,
          edit : true,
          picture : article.pictures,
          categorys,
        }
      }else{
        return {
          title: "",
          author: "",
          bodyHTML: "",
          edit : false,
          categorys,
        }
      }
    }else{
      return {
        title: "",
        author: "",
        bodyHTML: "",
        edit : false,
        categorys,
      }
    }
  }
}
