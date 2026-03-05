import {
  Controller,
  Get,
  UseGuards,
  Res,
  Req,
  Param,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AppService } from './app.service';
import { PasswordGuard, PasswordGuardHard } from './password.guard';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  check(@Res() res: Response, @Req() req: Request) {
    if (req.cookies['kj_auth'] === 'ok') {
      res.render('startpage', { check: true });
    } else {
      res.render('startpage', { check: false });
    }
  }

  @Get('/tools/2dfiguremaker/*')
  securepage2d(@Res() res: Response, @Req() req: Request) {
    const relativePath =
      req.path.replace(/^\/tools\/2dfiguremaker\/?/, '') || 'index.html';
    return res.sendFile(
      join(process.cwd(), 'tools', '2dfiguremaker', relativePath),
    );
  }

  @Get('/tools/3dfiguremaker/*')
  securepage3d(@Res() res: Response, @Req() req: Request) {
    const relativePath =
      req.path.replace(/^\/tools\/3dfiguremaker\/?/, '') || 'index.html';
    return res.sendFile(
      join(process.cwd(), 'tools', '3dfiguremaker', relativePath),
    );
  }

  @Get('/tools/random_with_excel/*')
  @UseGuards(PasswordGuardHard)
  securepageran(@Res() res: Response, @Req() req: Request) {
    const relativePath =
      req.path.replace(/^\/tools\/random_with_excel\/?/, '') || 'index.html';
    const filePath = join(
      process.cwd(),
      'tools',
      'random_with_excel',
      relativePath,
    );
    return res.sendFile(filePath, (err) => {});
  }

  @Get('/tools/random_with_excel/StreamingAssets/:file')
  async getCsv(@Param('file') file: string, @Res() res: Response) {
    const filePath = join(
      process.cwd(),
      'tools',
      'random_with_excel',
      'StreamingAssets',
      file,
    );
    if (!existsSync(filePath)) {
      return res.status(404).send('Not found');
    }

    // CSV をテキストとして返す
    res.type('text/csv');
    return res.sendFile(filePath, (err) => {
      if (err) res.end();
    });
  }
}
