import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EEnvKey, ENodeEnvironment } from '@constants/env.constant';

import ormconfig from '~/ormconfig';

function getOrmconfig() {
	return Object.assign(ormconfig, {
		logging: process.env[EEnvKey.NODE_ENV] === ENodeEnvironment.DEVELOPMENT ? ormconfig.logging : undefined,
	});
}

@Module({
	imports: [TypeOrmModule.forRoot(getOrmconfig())],
})
export class MySQLModule {}
