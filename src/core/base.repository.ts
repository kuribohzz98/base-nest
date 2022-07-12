import { Repository, SelectQueryBuilder } from 'typeorm';

import { ETableName } from '@constants/entity.constant';

import { IPagination } from '@shared/interfaces/query.interface';

import { EntityAttribute } from '../entities';

type TReferenceSelect = Partial<EntityAttribute>;

export abstract class BaseRepository<E> extends Repository<E> {
	protected abstract alias: ETableName;
	protected entityAttributes: keyof E;

	protected createQb() {
		return this.createQueryBuilder(this.alias);
	}

	protected selectBuilder(qb: SelectQueryBuilder<E>, select: Exclude<keyof E, 'id'>[]);
	protected selectBuilder(
		qb: SelectQueryBuilder<E>,
		select: Exclude<keyof E, 'id'>[],
		referenceSelects: TReferenceSelect,
	);

	protected selectBuilder(
		qb: SelectQueryBuilder<E>,
		select: Exclude<keyof E, 'id'>[],
		referenceSelects?: TReferenceSelect,
	) {
		qb.select(select.map(s => `${this.alias}.${s as string}`).concat(`${this.alias}.id`));
		if (referenceSelects) {
			for (const key of Object.keys(referenceSelects)) {
				if (key === this.alias) continue;
				qb.addSelect((referenceSelects[key] as string[]).map(s => `${key}.${s}`));
			}
		}
		return qb;
	}

	protected selectBuilderRaw(qb: SelectQueryBuilder<E>, select: (keyof E)[]);
	protected selectBuilderRaw(qb: SelectQueryBuilder<E>, select: (keyof E)[], referenceSelects: TReferenceSelect);

	protected selectBuilderRaw(qb: SelectQueryBuilder<E>, select: (keyof E)[], referenceSelects?: TReferenceSelect) {
		for (const iterator of select as string[]) {
			qb.addSelect(`${this.alias}.${iterator}`, iterator);
		}
		if (referenceSelects) {
			for (const key of Object.keys(referenceSelects)) {
				if (key === this.alias) continue;
				for (const s of referenceSelects[key] as string[]) {
					qb.addSelect(`${key}.${s}`, `${key}_${s}`);
				}
			}
		}
		return qb;
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
