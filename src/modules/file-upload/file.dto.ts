import { ApiProperty } from '@nestjs/swagger';

import { EFolderType } from '@constants/api.constant';

import { DtoEnum } from '@shared/decorators/dto/enum.decorator';
import { DtoString } from '@shared/decorators/dto/string.decorator';

export class FolderTypesParam {
	@DtoEnum(EFolderType)
	folder: EFolderType;
}

export class UploadImageDto {
	@ApiProperty({ format: 'binary' })
	image: string;
}

export class ImageResponseDto {
	@ApiProperty()
	path: string;
}

export class UploadUrlParamDto {
	@DtoString({ trim: true })
	type: string;
}

export class UploadUrlResponseDto {
	@ApiProperty()
	uploadURL: string;

	@ApiProperty()
	key: string;

	constructor(data: UploadUrlResponseDto) {
		Object.assign(this, data);
	}
}
