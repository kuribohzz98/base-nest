import { Injectable } from '@nestjs/common';

import { UserEntity } from '@entities/user.entity';

import { UserRepository } from './user.repository';
import { randomUidUser } from './utils/user.util';

@Injectable()
export class UserService {
	constructor(private readonly userRepo: UserRepository) {}

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
		const user = await this.userRepo.findOne({ email, isVerified: true }, { select: ['id'] });
		return !!user;
	}
}
