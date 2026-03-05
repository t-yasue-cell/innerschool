import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { PassportModule } from '@nestjs/passport';
// import { ConfigModule } from '@nestjs/config';
// import { GoogleStrategy } from './auth/strategies/google.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { MexeasyController } from './mexeasy/mexeasy.controller';
import { MexeasyService } from './mexeasy/mexeasy.service';
import { ManagehomeworkController } from './managehomework/managehomework.controller';
import { ManagehomeworkService } from './managehomework/managehomework.service';
import { BbsModule } from './bbs/bbs.module';
import { PrismaService } from './prisma.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    PassportModule.register({ session: false }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'public'), // public フォルダを指定
    }),
    // ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BbsModule,    
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController, AuthController, MexeasyController, ManagehomeworkController],
  providers: [/* GoogleStrategy, */ AppService, AuthService, MexeasyService, ManagehomeworkService, PrismaService],
  exports: [PrismaService]
})
export class AppModule {}
