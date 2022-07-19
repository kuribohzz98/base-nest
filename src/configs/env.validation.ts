import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

import { EEnvKey, ENodeEnvironment } from '@constants/env.constant';

import { DtoEnum } from '@shared/decorators/dto/enum.decorator';
import { DtoInt } from '@shared/decorators/dto/number.decorator';
import { DtoString } from '@shared/decorators/dto/string.decorator';

export function envValidate(config: Record<string, any>) {
	const validatedConfig = plainToClass(EnvironmentVariables, config, { enableImplicitConversion: true });
	const errors = validateSync(validatedConfig, { skipMissingProperties: false });

	if (errors.length > 0) {
		throw new Error(errors.toString());
	}
	return validatedConfig;
}

class EnvironmentVariables implements Record<EEnvKey, number | string> {
	@DtoEnum(ENodeEnvironment, { optional: true })
	NODE_ENV: ENodeEnvironment;

	@DtoInt({ min: 1024, optional: true })
	PORT: number;

	@DtoString({ optional: true })
	GLOBAL_PREFIX: string;

	@DtoString({ optional: true })
	SWAGGER_PATH: string;

	@DtoString()
	SECRET_JWT: string;

	@DtoString()
	SECRET_REFRESH_JWT: string;

	@DtoInt({ min: 1, optional: true })
	RATE_LIMITTER_TTL: number;

	@DtoInt({ min: 1, optional: true })
	RATE_LIMITTER_LIMIT: number;

	@DtoString()
	AWS_REGION: string;

	@DtoString()
	AWS_ACCESS_KEY_ID: string;

	@DtoString()
	AWS_SECRET_ACCESS_KEY: string;

	@DtoString()
	AWS_SES_SEND_FROM: string;

	@DtoString()
	AWS_S3_BUCKET: string;

	@DtoString()
	AWS_S3_END_POINT: string;

	@DtoString({ optional: true })
	DATABASE_TYPE: string;

	@DtoString({ optional: true })
	DATABASE_HOST: string;

	@DtoString({ optional: true })
	DATABASE_USER: string;

	@DtoString({ optional: true })
	DATABASE_PASSWORD: string;

	@DtoInt({ min: 1024, optional: true })
	DATABASE_PORT: number;

	@DtoString({ optional: true })
	DATABASE: string;

	@DtoString()
	CLIENT_URL: string;
}
