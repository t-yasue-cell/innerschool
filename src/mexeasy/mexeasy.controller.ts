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
import { PasswordGuard} from '../password.guard';
import express from 'express'
import { MexeasyService } from './mexeasy.service';

@Controller('mexeasy')
export class MexeasyController {
  constructor(private readonly mexeasyService: MexeasyService) {}

  @Get()
  @Render('excelPage')
  openmenu() {
    return { title: "excel作業簡易化"}
  }

  @Get('read')
  @Render('excelReadPage')
  readmenu(@Req() req: any) {
    return { data: req.session.excelJson }
  }

  @Post('lab')
  dolabel(@Res() res: express.Response, @Req() req:any){
    const doing = req.body.do;
    const col = parseInt(req.body.col);
    if(doing == "sort"){ 
      req.session.excelJson = this.mexeasyService.sortlist(col, req.session.excelJson);
    }else if(doing == "small"){
      req.session.excelJson = this.mexeasyService.compression(col, req.session.excelJson);
    }
    return res.redirect("/mexeasy/read");
  }

  @Post()
  @UseInterceptors(
    FileInterceptor("file", {
      storage: memoryStorage(),
    }),
  )
  uploadExcel(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: express.Response,
    @Req() req: any,
  ) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(sheet);

    req.session.excelJson = jsonData;

    return res.redirect("/mexeasy/read");
  }
  
  @Post("download")
  downloadExcel(@Res() res: express.Response, @Req() req:any){
    const filename = req.body.filename;
    const ws = XLSX.utils.json_to_sheet(req.session.excelJson);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const filePath = "./output.xlsx";
    XLSX.writeFile(wb, filePath);

    res.download(filePath, filename+".xlsx");
  }
}
