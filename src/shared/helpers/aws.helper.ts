import { Credentials, S3, SES } from 'aws-sdk';

import { EEnvKey } from '@constants/env.constant';

class AWSHelper {
	private readonly _credentials: Credentials;

	constructor() {
		this._credentials = new Credentials({
			accessKeyId: process.env[EEnvKey.AWS_ACCESS_KEY_ID],
			secretAccessKey: process.env[EEnvKey.AWS_SECRET_ACCESS_KEY],
		});
	}

	get ses() {
		return new SES({ credentials: this._credentials, region: process.env[EEnvKey.AWS_REGION] });
	}

	get s3() {
		return new S3({ credentials: this._credentials, region: process.env[EEnvKey.AWS_REGION] });
	}
}

export const awsHelper = new AWSHelper();
