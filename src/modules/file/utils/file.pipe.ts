import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import * as heic from 'heic-convert';

import { MAX_SIZE_GIF } from '@constants/api.constant';

import { FileException } from '@shared/exceptions/http-exceptions/file.exception';
import { httpException } from '@shared/exceptions/http.exception';

import { IFileUploadData } from '../file.interface';

@Injectable()
export class FilePipe implements PipeTransform<any> {
	async transform(value: IFileUploadData, { type }: ArgumentMetadata) {
		if (value && type === 'custom') {
			if (value?.originalname && value.originalname.toLowerCase().match(/\.heic$/)) {
				const buffer = await heic({
					buffer: value?.buffer, // the HEIC file buffer
					format: 'JPEG', // output format
					quality: 1, // the jpeg compression quality, between 0 and 1
				});
				return {
					fieldname: value.fieldname,
					originalname: value.originalname.replace(/\.(heic|HEIC)$/, '.jpg'),
					encoding: value.encoding,
					mimetype: 'image/jpeg',
					buffer,
					size: Buffer.byteLength(buffer),
				} as IFileUploadData;
			}
			if (value?.originalname && value.originalname.toLowerCase().match(/\.gif$/)) {
				if (value.size > MAX_SIZE_GIF) {
					httpException(FileException.UploadFile, 'PAYLOAD_TOO_LARGE', 'gif-too-large', {
						size: `${MAX_SIZE_GIF / 1024}KB`,
					});
				}
			}
		}
		return value;
	}
}
