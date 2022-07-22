import type { DataSource } from 'typeorm';

import type { OrmTransaction } from './base.transaction';

export class TransactionExecutorService {
	constructor(private readonly dataSource: DataSource) {}

	exec<T extends OrmTransaction>(trans: T) {
		return trans.exec(this.dataSource);
	}
}
