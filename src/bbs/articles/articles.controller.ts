import { Controller, Get, Post, Body, Patch, Param, Delete, Render, UseGuards, Query, Res } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { PicturesService } from '../pictures/pictures.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PasswordGuardHard } from 'src/password.guard';
import express from 'express'
import { PrismaService } from 'src/prisma.service';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CategorysService } from '../categorys/categorys.service';

@Controller('bbs/articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService,
              private readonly picturesService: PicturesService,
              private readonly categoryServise: CategorysService,
              private readonly prisma : PrismaService) {}

  @Post()
  @UseGuards(PasswordGuardHard)
  async create(@Body() createArticleDto: CreateArticleDto,
               @Res() res: express.Response) {
    createArticleDto.category = Array.isArray(createArticleDto.category)
    ? createArticleDto.category
    : createArticleDto.category
      ? [createArticleDto.category]
      : [];
    const article = await this.articlesService.create(createArticleDto);
    if (createArticleDto.pictureId) {
      const picture = await this.prisma.picture.findUnique({
        where: { id: Number(createArticleDto.pictureId) }
      })
      if (!picture) {
        throw new Error('picture not found');
      }
      const tempPath = path.join(
        process.cwd(),
        picture.address,
      );
      const filename = path.basename(picture.address);

      const newRelativePath = `/uploads/articles/${filename}`;
      const newAbsolutePath = path.join(
        process.cwd(),
        newRelativePath,
      );

      await fs.mkdir(path.dirname(newAbsolutePath), { recursive: true });

      await fs.rename(tempPath, newAbsolutePath);
      await this.prisma.picture.update({
        where: { id: Number(createArticleDto.pictureId) },
        data: {
          isUsed: true,
          articleId: article.id,
          address: newRelativePath,
        },
      });
    }
    res.redirect("/bbs/articles");
  }

  @Post(":id")
  @UseGuards(PasswordGuardHard)
  async patchordelete(@Param('id') id: string, @Query('method') method: string, 
                @Body() updateArticleDto: UpdateArticleDto,
                @Res() res: express.Response) {
    if(method === "patch"){
      await this.articlesService.update(Number(id), updateArticleDto);
      if (updateArticleDto.pictureId) {
        const oldpicture = await this.prisma.picture.findFirst({
          where: { articleId: Number(id)},
        });
        if(oldpicture){
          if(oldpicture.id != Number(updateArticleDto.pictureId)){
            fs.unlink(path.join(process.cwd(),oldpicture.address));
            await this.prisma.picture.delete({
              where: { id: oldpicture.id }
            });
          }
        }
        const picture = await this.prisma.picture.findUnique({
          where: { id: Number(updateArticleDto.pictureId) }
        })
        if (!picture) {
          throw new Error('picture not found');
        }
        const tempPath = path.join(
          process.cwd(),
          picture.address,
        );
        const filename = path.basename(picture.address);

        const newRelativePath = `/uploads/articles/${filename}`;
        const newAbsolutePath = path.join(
          process.cwd(),
          newRelativePath,
        );

        await fs.mkdir(path.dirname(newAbsolutePath), { recursive: true });

        await fs.rename(tempPath, newAbsolutePath);
        await this.prisma.picture.update({
          where: { id: Number(updateArticleDto.pictureId) },
          data: {
            isUsed: true,
            articleId: Number(id),
            address: newRelativePath,
          },
        });
      }
    }else if(method ==="delete"){
      if (updateArticleDto.pictureId){
      const oldpicture = await this.prisma.picture.findFirst({
        where: { articleId: Number(id)},
      });
      if(oldpicture){
        if(oldpicture.id != Number(updateArticleDto.pictureId)){
          fs.unlink(path.join(process.cwd(),oldpicture.address));
          await this.prisma.picture.delete({
            where: { id: oldpicture.id }
          });
        }
      }

      }
      await this.articlesService.remove(Number(id));
    }
    return res.redirect("/bbs/articles");
  }

  @Get()
  @UseGuards(PasswordGuardHard)
  @Render("bbsarticles")
  async findAll(@Query('category') category?:string) {
    if(!category){
      const articles = await this.articlesService.findAll();
      return { pagetitle:"Home",articles };
    }else{
      const articles = await this.articlesService.findAllbyCategory(Number(category));
      const title = await this.categoryServise.findOne(Number(category));
      if(Number(category)===0){
        return { pagetitle:"カテゴリなし", articles };
      }
      return { pagetitle:title?.name, articles };
    }
  }

  @Get(':id')
  @UseGuards(PasswordGuardHard)
  @Render("article")
  async findOne(@Param('id') id: string) {
    const article = await this.articlesService.findOne_include(+id);
    const categorys = await this.categoryServise.findByArticle(+id);
    return { article, categorys };
  }

  @Patch(':id')
  @UseGuards(PasswordGuardHard)
  update(@Param('id') id: string, @Body() updateArticleDto: UpdateArticleDto) {
    return this.articlesService.update(+id, updateArticleDto);
  }

  @Delete(':id')
  @UseGuards(PasswordGuardHard)
  remove(@Param('id') id: string) {
    return this.articlesService.remove(+id);
  }
}
