import type { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import type {
	DataSource,
	DataSourceOptions,
	EntityManager,
	EntityTarget,
	ObjectLiteral,
	QueryRunner,
	Repository as TypeOrmRepository,
} from 'typeorm';

type Repository = new (target: EntityTarget<any>, manager: EntityManager, queryRunner?: QueryRunner) => ThisType<
	TypeOrmRepository<ObjectLiteral>
>;

function getProviders(repositories: Repository[], dataSource?: string | DataSource | DataSourceOptions) {
	return repositories.map(repo => {
		const entity = Reflect.getMetadata('custom-repo:entity', repo);
		if (!entity) {
			throw new Error(`Repository: ${repo.name} undetermined entity`);
		}
		return {
			module: CustomRepositoryModule,
			provide: repo,
			useFactory: (dataSource: DataSource) => {
				return dataSource.options.type === 'mongodb'
					? dataSource.getMongoRepository(entity).extend(new repo(entity, dataSource.manager))
					: dataSource.getRepository(entity).extend(new repo(entity, dataSource.manager));
			},
			inject: [getDataSourceToken(dataSource)],
		} as Provider<any>;
	});
}

export class CustomRepositoryModule {
	static forFeature(repositories: Repository[], dataSource?: string | DataSource | DataSourceOptions): DynamicModule {
		return {
			module: CustomRepositoryModule,
			providers: getProviders(repositories, dataSource),
			exports: repositories,
		};
	}
}
