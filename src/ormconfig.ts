import * as dotenv from 'dotenv';
import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';

import { EEnvKey } from '@constants/env.constant';

import { getAlreadyExistsEnvFile } from '@shared/helpers/database.helper';

dotenv.config({ path: join(__dirname, '..', getAlreadyExistsEnvFile()) });

export const migrationDir = join(__dirname, 'migrations');

export default {
	type: process.env[EEnvKey.DATABASE_TYPE],
	host: process.env[EEnvKey.DATABASE_HOST],
	port: process.env[EEnvKey.DATABASE_PORT],
	username: process.env[EEnvKey.DATABASE_USER],
	password: process.env[EEnvKey.DATABASE_PASSWORD],
	database: process.env[EEnvKey.DATABASE],
	entities: [join(__dirname, '/entities/*.entity{.js,.ts}')],
	migrationsTableName: 'custom_migration_table',
	migrations: [join(migrationDir, '*{.js,.ts}')],
	logging: true,
	synchronize: false,
	cache: true,
	timezone: 'Z',
	extra: {
		decimalNumbers: true,
	},
} as DataSourceOptions;
