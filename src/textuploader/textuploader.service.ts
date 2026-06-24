import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const DEST_MAP: Record<string, string> = {
  pdf:  '/var/www/pdf',
  img:  '/var/www/img',
  jpg:  '/var/www/img',  // ← 追加
  png:  '/var/www/img',
  docx: '/var/www/docx',
};

@Injectable()
export class TextuploaderService {
  async saveFile(file: Express.Multer.File): Promise<string> {
    const ext = path.extname(file.originalname).replace('.', '').toLowerCase();

    if (!DEST_MAP[ext]) {
      throw new BadRequestException(`許可されていない拡張子です: ${ext}`);
    }

    const destPath = path.join(
      DEST_MAP[ext],
      Buffer.from(file.originalname, 'latin1').toString('utf8')  // ← これを追加
    );
    const tmpPath  = file.path;
    

    await execAsync(`sudo cp "${tmpPath}" "${destPath}"`);
    await execAsync(`sudo chmod 644 "${destPath}"`);
    await fs.unlink(tmpPath);

    return destPath;
  }
}