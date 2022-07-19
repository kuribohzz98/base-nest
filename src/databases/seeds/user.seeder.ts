import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

import { UserEntity } from '@entities/user.entity';

export default class UserSeeder implements Seeder {
	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
		// const repository = dataSource.getRepository(UserEntity);
		// await repository.insert([
		// 	{
		// 		uid: randomUidUser()
		// 	},
		// ]);

		// // ---------------------------------------------------

		const userFactory = factoryManager.get(UserEntity);
		// save 1 factory generated entity, to the database
		await userFactory.save();

		// save 5 factory generated entities, to the database
		// await userFactory.saveMany(5);
	}
}
