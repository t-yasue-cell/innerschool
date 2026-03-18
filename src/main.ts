import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { join } from 'path';
const cookieParser = require('cookie-parser');
import { RedirectFilter } from './exeption.filter';
import * as express from 'express';
import session from "express-session";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, {
    logger: false, // ← これでNestLoggerを無効化(本番環境のみ削除)
    },
  );
  app.enableCors({
    origin: '*', // 必要に応じてアクセス可能なオリジンに限定
    credentials: true, // Cookie を送信する場合は true
  });
  // app.use('/tools/random_with_excel/StreamingAssets', express.static(join(__dirname, '..', 'public/StreamingAssets')));
  app.setBaseViewsDir(join(process.cwd(), 'views'));
  app.use(
    '/uploads',
    express.static(join(process.cwd(), 'uploads')),
  );
  app.setViewEngine('ejs');
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.useGlobalFilters(new RedirectFilter());
  app.use(
    session({
      secret: "secret-key",
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(/*process.env.PORT ??*/ 3000 ,'0.0.0.0'); // イントラネットに移すとき、このコメントアウトを外してlocalhostじゃなくする必要ある
}
bootstrap();