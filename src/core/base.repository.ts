import { Repository, SelectQueryBuilder } from 'typeorm';

import { ETableName } from '@constants/entity.constant';

import { IPagination } from '@shared/interfaces/query.interface';

export abstract class BaseRepository<E> extends Repository<E> {
	protected abstract alias: ETableName;

	protected createQb() {
		return this.createQueryBuilder(this.alias);
	}

	protected queryBuilderAddPagination(
		queryBuilder: SelectQueryBuilder<E>,
		data: Partial<IPagination>,
	): SelectQueryBuilder<E> {
		if (typeof data !== 'object' || !data.limit || !data.page) {
			return queryBuilder;
		}
		queryBuilder.take(data.limit);
		queryBuilder.skip((data.page - 1) * data.limit);
		return queryBuilder;
	}

	protected queryBuilderAddPaginationRaw(
		queryBuilder: SelectQueryBuilder<E>,
		data: Partial<IPagination>,
	): SelectQueryBuilder<E> {
		if (typeof data !== 'object' || !data.limit || !data.page) {
			return queryBuilder;
		}
		queryBuilder.limit(data.limit);
		queryBuilder.offset((data.page - 1) * data.limit);
		return queryBuilder;
	}
}
