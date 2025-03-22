import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  providers: [FileService, FileResolver],
  exports: [FileService],
})
export class FileModule {} 