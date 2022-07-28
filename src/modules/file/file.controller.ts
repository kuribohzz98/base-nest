import { BadRequestException, Controller, Param, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { MAX_SIZE_FILE } from '@constants/api.constant';
import { EContextException } from '@constants/exeption.constant';

import { HttpGet, HttpPost } from '@shared/decorators/controller/http-methods.decorator';
import { HttpResponseError, HttpResponseSuccess } from '@shared/decorators/controller/http-response.decorator';
import { FileException } from '@shared/exceptions/http-exceptions/file.exception';
import { getExceptionContext, httpExDocResponse, IResponseException } from '@shared/exceptions/http.exception';

import {
	FolderTypesParam,
	ImageResponseDto,
	UploadImageDto,
	UploadUrlParamDto,
	UploadUrlResponseDto,
} from './file.dto';
import { IFileUploadData } from './file.interface';
import { FileService } from './file.service';
import { FilePipe } from './utils/file.pipe';

const fileException = new FileException.UploadFile();

function filterImage(req, image, callback) {
	if (!image.originalname.toLowerCase().match(/\.(jpg|jpeg|png|gif|tiff|heic|jfif)$/)) {
		return callback(
			new BadRequestException({
				context: getExceptionContext(EContextException.FILE, 'UPLOAD'),
				message: fileException['file-invalid'],
				type: 'file-invalid',
			} as IResponseException),
			false,
		);
	}
	callback(null, true);
}

@ApiTags('Files')
@Controller('files')
export class FileUploadController {
	constructor(private fileService: FileService) {}

	@HttpPost('upload-image/:folder', { exValidateBody: true })
	@UseInterceptors(
		FileInterceptor('image', {
			limits: { files: 1, fileSize: MAX_SIZE_FILE },
			fileFilter: filterImage.bind(this),
		}),
	)
	@UsePipes(FilePipe)
	@ApiConsumes('multipart/form-data')
	@ApiBody({ type: UploadImageDto })
	@HttpResponseSuccess({ type: ImageResponseDto, status: 201 })
	@HttpResponseError([
		httpExDocResponse(FileException.UploadFile, 'BAD_REQUEST', 'file-invalid'),
		httpExDocResponse(FileException.UploadFile, 'PAYLOAD_TOO_LARGE', 'gif-too-large'),
	])
	uploadImage(@UploadedFile() image: IFileUploadData, @Param() param: FolderTypesParam) {
		return this.fileService.uploadImagePublicToS3(image, param.folder);
	}

	@HttpGet('upload-url')
	@HttpResponseSuccess({ type: UploadUrlResponseDto })
	getUploadUrl(@Param() param: UploadUrlParamDto) {
		return this.fileService.getS3UploadUrl(param.type);
	}
}
