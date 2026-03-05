import {
  Controller,
  UseGuards,
  Get,
  Render,
  Req,
  Res,
  Post,  
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import * as XLSX from "xlsx";
import { PasswordGuard, PasswordGuardHard } from '../password.guard';
import { join } from 'path';
import { existsSync } from 'fs';
import express from 'express'
import { ManagehomeworkService } from "./managehomework.service";
import * as ExcelJS from 'exceljs';

@Controller('managehomework')
export class ManagehomeworkController {
  constructor(private readonly managehomeworkService: ManagehomeworkService) {}
  
  @Get()
  @UseGuards(PasswordGuard)
  @Render('excelPage')
  openmenu() {
    return {
        title:"提出物管理",
    }
  }

  @Post("managehomework")
  @UseGuards(PasswordGuard)
  async uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: express.Response,
    @Req() req: any,
  ) {
    req.session.workbook = new ExcelJS.Workbook();
    await req.session.workbook.xlsx.load(file.buffer);

    const sheet = req.session.workbook.worksheets[0];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    return res.redirect("/managehomework/read");
  }

  @Get("read")
  @UseGuards(PasswordGuard)
  manage(){

  }
}
