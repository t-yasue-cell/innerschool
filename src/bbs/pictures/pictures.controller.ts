import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { CreatePictureDto } from './dto/create-picture.dto';
import { UpdatePictureDto } from './dto/update-picture.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PrismaService } from '../../prisma.service';
import { diskStorage } from 'multer';
import { Cron } from '@nestjs/schedule';
import * as fs from 'fs';


@Controller('bbs/pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService,
              private readonly prisma: PrismaService) {}

  @Cron('0 4 * * *')
  handleCron() {
    this.deleteUnusedPictures();
  }

  async deleteUnusedPictures() {
    const limit = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const pictures = await this.prisma.picture.findMany({
      where: {
        isUsed: false,
        createdAt: { lt: limit },
      },
    });

    for (const pic of pictures) {
      fs.unlinkSync(`.${pic.address}`);
      await this.prisma.picture.delete({ where: { id: pic.id } });
    }
  }


  @Post('temp')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/temp',
        filename: (_, file, cb) => {
          const filename = Date.now() + '-' + file.originalname;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadTempPicture(
    @UploadedFile() file: Express.Multer.File,
  ) {
    const picture = await this.prisma.picture.create({
      data: {
        name: file.originalname,
        address: `/uploads/temp/${file.filename}`,
        isUsed: false,
        articleId: null,
      },
    });

    return {
      pictureId: picture.id,
      address: picture.address,
    };
  }


  @Get()
  findAll() {
    return this.picturesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.picturesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
    return this.picturesService.update(+id, updatePictureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.picturesService.remove(+id);
  }

}
