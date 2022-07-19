import { Injectable } from '@nestjs/common';

import { TransactionExecutorService } from '@core/transaction';

import { UserEntity } from '@entities/user.entity';

import { CreateUserTrans } from './transactions/create-user.transaction';
import { UserRepository } from './user.repository';
import { randomUidUser } from './utils/user.util';

@Injectable()
export class UserService {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly transExecService: TransactionExecutorService,
	) {}

	onModuleInit() {
		// this.createUser()
	}

	async getUid(): Promise<string> {
		const uid = randomUidUser();
		const user = await this.userRepo.findOne({ where: { uid }, select: ['id', 'uid'] });
		if (user) {
			return this.getUid();
		}
		return uid;
	}

	async register(data: Omit<Partial<UserEntity>, 'uid'>) {
		const uid = await this.getUid();
		await this.userRepo.insert({ ...data, uid });
		return uid;
	}

	async checkEmailAlreadyExists(email: string) {
		if (!email) return;
		const user = await this.userRepo.findOne({ where: { email, isVerified: true }, select: ['id'] });
		return !!user;
	}

	/**
	 * example use transaction
	 */
	async createUser() {
		const uid = await this.getUid();
		const result = await this.transExecService.exec(
			new CreateUserTrans({ uid, firstName: 'huhu', lastName: 'hehe' }),
		);
		return result;
	}
}
