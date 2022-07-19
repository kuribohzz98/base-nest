import type { DynamicModule } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import type { DataSource } from 'typeorm';

import { TransactionExecutorService } from './transaction-executor.service';

function getProvide(connectionName: string) {
	let provide: string | typeof TransactionExecutorService = TransactionExecutorService;
	if (typeof connectionName === 'string' && connectionName !== 'default') {
		provide = connectionName;
	}
	return provide;
}

export class TransactionExecutorModule {
	static forRoot(connectionName?: string): DynamicModule {
		return {
			global: true,
			module: TransactionExecutorModule,
			providers: [
				{
					provide: getProvide(connectionName),
					useFactory: (dataSource: DataSource) => new TransactionExecutorService(dataSource),
					inject: [getDataSourceToken(connectionName)],
				},
			],
			exports: [TransactionExecutorService],
		};
	}

	static forFeature(connectionName?: string): DynamicModule {
		return {
			module: TransactionExecutorModule,
			providers: [
				{
					provide: getProvide(connectionName),
					useFactory: (dataSource: DataSource) => new TransactionExecutorService(dataSource),
					inject: [getDataSourceToken(connectionName)],
				},
			],
			exports: [TransactionExecutorService],
		};
	}
}
