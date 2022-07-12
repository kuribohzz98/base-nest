import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConnectionOptions } from 'typeorm';

import { EEnvKey } from '@constants/env.constant';

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: async (configService: ConfigService) => {
				const connectionOptions = await getConnectionOptions();
				const host = configService.get<string>(EEnvKey.DATABASE_HOST);
				const port = configService.get<number>(EEnvKey.DATABASE_PORT);
				const username = configService.get<string>(EEnvKey.DATABASE_USER);
				const password = configService.get<string>(EEnvKey.DATABASE_PASSWORD);
				const database = configService.get<string>(EEnvKey.DATABASE);
				return Object.assign(connectionOptions, {
					host: host || connectionOptions['host'],
					port: port || connectionOptions['port'] || 3306,
					username: username || connectionOptions['username'],
					password: password || connectionOptions['password'],
					database: database || connectionOptions.database,
					logging:
						process.env.NODE_ENV && process.env.NODE_ENV === 'development'
							? connectionOptions.logging
							: undefined,
				});
			},
		}),
	],
})
export class MySQLModule {}
