import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CategorysService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data:{
        name:CreateCategoryDto.name,
      }
    });
  }

  async findAll() {
    const result = await this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // ★ 念のため（null にならないけど契約として）
    return result ?? [];
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: {id:id}
    });
  }

  findByArticle(id: number){
    return this.prisma.category.findMany({
      where: {
        articles: {
          some: {
            articleId: id,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }) ?? [];
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return this.prisma.category.delete({
      where : { id: id }
    })
  }
}
