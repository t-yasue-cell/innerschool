import { Controller, Get, Post, Body, Patch, Param, Delete, Render, Query, Res } from '@nestjs/common';
import { CategorysService } from './categorys.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import express from 'express';

@Controller('bbs/categorys')
export class CategorysController {
  constructor(private readonly categorysService: CategorysService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categorysService.create(createCategoryDto);
  }

  @Post(':id')
  async delete(@Param('id') id: string, @Query('method') method: string, @Res() res: express.Response){
    if(method === "delete"){
      await this.categorysService.remove(Number(id));
    }
    return res.redirect('/bbs/categorys');
  }

  @Get()
  @Render("categorys")
  async findAll() {
    return {categorys: await this.categorysService.findAll()};
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categorysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categorysService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categorysService.remove(+id);
  }
}
