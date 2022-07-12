import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getType } from 'mime';
import * as sharp from 'sharp';
import { URL } from 'url';

import { EFolderType, MIN_SIZE_IMAGE, MIN_SIZE_IMAGE_MINIFY } from '@constants/api.constant';
import { EEnvKey } from '@constants/env.constant';

import { awsHelper } from '@shared/helpers/aws.helper';
import { randomHex } from '@shared/utils/common.util';

import { UploadUrlResponseDto } from './file.dto';
import { IFileUploadData } from './file.interface';

@Injectable()
export class FileService implements OnModuleInit {
	private _s3Bucket: string;

	constructor(private readonly configService: ConfigService) {}

	onModuleInit() {
		this._s3Bucket = this.configService.get<string>(EEnvKey.AWS_S3_BUCKET);
	}

	async uploadImagePublicToS3(image: IFileUploadData, folder: EFolderType) {
		const S3_END_POINT = this.configService.get<string>(EEnvKey.AWS_S3_END_POINT);
		const { originalname, mimetype, size } = image;

		if (!image.originalname.toLowerCase().match(/\.(gif)$/)) {
			const minSizeMinify = MIN_SIZE_IMAGE_MINIFY.GENERAL;
			const minSize = MIN_SIZE_IMAGE.GENERAL;
			if (size / minSize > 1) {
				image.buffer = await this.compressImage(image.buffer, size, minSizeMinify);
			}
		}
		const uploadResult = await awsHelper.s3
			.upload({
				Bucket: `${this._s3Bucket}/${folder}`,
				Key: `${randomHex(5)}-${originalname}`,
				Body: image.buffer,
				ACL: 'public-read',
				ContentType: mimetype,
			})
			.promise();
		return { path: `${S3_END_POINT}/${uploadResult.Key}` };
	}

	deleteFileS3(Bucket: string, Key: string) {
		return awsHelper.s3.deleteObject({ Bucket, Key }).promise();
	}

	deleteFilesS3(Bucket: string, deletes: { Key: string }[]) {
		return awsHelper.s3.deleteObjects({ Bucket, Delete: { Objects: deletes } }).promise();
	}

	deleteFileS3ByFileUrl(_url: string) {
		const url = new URL(_url);
		const splitPathname = url.pathname.split('/');
		if (!splitPathname.length) return;
		splitPathname.pop();
		const key = _url.split('/').pop();
		const bucket = `${this._s3Bucket}${splitPathname.join('/')}`;
		return this.deleteFileS3(bucket, key);
	}

	private async compressImage(imageBuffer: Buffer, size: number, minSizeMinify: number): Promise<Buffer> {
		try {
			const { width, height } = await sharp(imageBuffer).metadata();
			const ratio = Math.sqrt(size / minSizeMinify);
			return sharp(imageBuffer)
				.resize(Math.floor(width / ratio), Math.floor(height / ratio))
				.toBuffer();
		} catch (error) {
			console.log(error);
		}
	}

	// get upload url
	async getS3UploadUrl(type: string) {
		const contentType = getType(type);
		const randomID = randomHex(8);
		const key = `${randomID}.${type}`;

		// Get signed URL from S3
		const s3Params = {
			Bucket: this._s3Bucket,
			Key: key,
			Expires: 300,
			ContentType: contentType,
			ACL: 'public-read',
		};
		const uploadURL = await awsHelper.s3.getSignedUrlPromise('putObject', s3Params);
		return new UploadUrlResponseDto({ uploadURL, key });
	}
}
