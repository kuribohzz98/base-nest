export enum EEnvKey {
	NODE_ENV = 'NODE_ENV',
	PORT = 'PORT',
	GLOBAL_PREFIX = 'GLOBAL_PREFIX',
	SWAGGER_PATH = 'SWAGGER_PATH',
	SECRET_JWT = 'SECRET_JWT',
	SECRET_REFRESH_JWT = 'SECRET_REFRESH_JWT',

	// rate limit
	RATE_LIMITTER_TTL = 'RATE_LIMITTER_TTL',
	RATE_LIMITTER_LIMIT = 'RATE_LIMITTER_LIMIT',

	// db
	DATABASE_TYPE = 'DATABASE_TYPE',
	DATABASE_HOST = 'DATABASE_HOST',
	DATABASE_USER = 'DATABASE_USER',
	DATABASE_PASSWORD = 'DATABASE_PASSWORD',
	DATABASE_PORT = 'DATABASE_PORT',
	DATABASE = 'DATABASE',

	// aws
	AWS_REGION = 'AWS_REGION',
	AWS_ACCESS_KEY_ID = 'AWS_ACCESS_KEY_ID',
	AWS_SECRET_ACCESS_KEY = 'AWS_SECRET_ACCESS_KEY',

	// aws ses
	AWS_SES_SEND_FROM = 'AWS_SES_SEND_FROM',

	// aws s3
	AWS_S3_BUCKET = 'AWS_S3_BUCKET',
	AWS_S3_END_POINT = 'AWS_S3_END_POINT',

	CLIENT_URL = 'CLIENT_URL',
}

export enum ENodeEnvironment {
	DEVELOPMENT = 'development',
	PRODUCTION = 'production',
	TEST = 'test',
}

export const EnvFilePath = [
	'.env.production',
	'.env.dev',
	'.env.development',
	'.env.test',
	'.env.development.local',
	'.env.production.local',
	'.env',
];
