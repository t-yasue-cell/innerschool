import { Injectable } from '@nestjs/common';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { PrismaService } from '../../prisma.service';
import * as path from 'path';

@Injectable()
export class ArticlesService {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(createArticleDto: CreateArticleDto) {
    const categories = await Promise.all(
      createArticleDto.category.map((name) =>
        this.prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        }),
      ),
    );

    return this.prisma.article.create({
      data: {
        title: createArticleDto.title,
        bodyHTML: createArticleDto.bodyHTML,
        author: createArticleDto.author,
        categories: {
          create: categories.map((c) => ({
            category: {
              connect: { id: c.id },
            },
          })),
        },
      },
    });
  }

  findAll() {
    return this.prisma.article.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
  
  findAllbyCategory(id:number) {
    if(id == 0){
      return this.prisma.article.findMany({
        where: {
          categories: {
            none: {}, // 配列 categories に1つも要素がないもの
          },
        },
        orderBy: { createdAt: 'desc' },
      }) ?? [];
    }
    return this.prisma.article.findMany({
      where: {
        categories: {
          some: {
            categoryId: id,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) ?? [];
  }

  findOne(id: number) {
    return this.prisma.article.findUnique({
      where: { id : id }
    });
  }

  findOne_include(id: number) {
    return this.prisma.article.findUnique({
      where: { id : id },
      include: { pictures : true}
    });
  }

  update(id: number, updateArticleDto: UpdateArticleDto) {
    return this.prisma.article.update({
      where: { id:id },
      data: {
        title: updateArticleDto.title,
        bodyHTML: updateArticleDto.bodyHTML,
        author: updateArticleDto.author,
      }
    })
  }

  async remove(id: number) {
    await this.prisma.picture.deleteMany({
      where: { articleId: id }
    })
    return await this.prisma.article.delete({
      where: { id: id }
    })
  }
}
