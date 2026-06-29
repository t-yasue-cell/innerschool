import {
  Controller, Post, UploadedFile, UseInterceptors,
  BadRequestException, Res,
  Render,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import express from 'express';
import * as path from 'path';
import { TextuploaderService } from './textuploader.service';

@Controller('text-uploader')
export class TextuploaderController {
  constructor(private readonly textUploaderService: TextuploaderService) {}

  @Get()
  @Render("textUploader")
  upload(){
    return {};
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({ destination: '/tmp' }),
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowed = ['.pdf', '.img', '.jpg', '.png', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        allowed.includes(ext)
          ? cb(null, true)
          : cb(new BadRequestException('許可されていないファイル形式です'), false);
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: express.Response,
  ) {
    if (!file) throw new BadRequestException('ファイルがありません');

    const BASE_URL = 'http://172.16.10.3';
    const savedPath = (await this.textUploaderService.saveFile(file)).replace('/var/www', BASE_URL);
    return res.json({ message: '保存完了', path: savedPath });
  }
}