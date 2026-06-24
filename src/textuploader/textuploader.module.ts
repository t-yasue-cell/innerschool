import { Module } from '@nestjs/common';
import { TextuploaderController } from './textuploader.controller';
import { TextuploaderService } from './textuploader.service';

@Module({
  controllers: [TextuploaderController],
  providers: [TextuploaderService],
})
export class TextuploaderModule {}