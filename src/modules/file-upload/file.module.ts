import { Module } from '@nestjs/common';

import { FileUploadController } from './file.controller';
import { FileService } from './file.service';

@Module({
	providers: [FileService],
	controllers: [FileUploadController],
})
export class FileUploadModule {}
