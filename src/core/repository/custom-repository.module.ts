import type { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import type { DataSource, DataSourceOptions } from 'typeorm';

type Class = new (...args: any[]) => any;

function getProviders(repositories: Class[], dataSource?: string | DataSource | DataSourceOptions) {
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
	static forFeature(repositories: Class[], dataSource?: string | DataSource | DataSourceOptions): DynamicModule {
		return {
			module: CustomRepositoryModule,
			providers: getProviders(repositories, dataSource),
			exports: repositories,
		};
	}
}
