import { Injectable } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class PicturesService {
  constructor(private readonly prisma: PrismaService) {}
  create(createPictureDto: CreatePictureDto) {
    return this.prisma.picture.create({
      data: {
        name : createPictureDto.name,
        articleId : createPictureDto.articleId, 
        address : createPictureDto.address,
        isUsed: createPictureDto.isUsed,
      }
    });
  }

  findAll() {
    return this.prisma.picture.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return this.prisma.picture.findUnique({
      where: { id : id }
    });
  }

  update(id: number, updatePictureDto: UpdatePictureDto) {
    return `This action updates a #${id} picture`;
  }

  remove(id: number) {
    return `This action removes a #${id} picture`;
  }
}
