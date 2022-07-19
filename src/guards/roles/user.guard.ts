import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { EGuardType } from '@constants/guard.constant';

import { BaseGuard } from '@core/base.guard';

import { UserEntity } from '@entities/user.entity';

import { IJwtPayload } from '@shared/interfaces/authentication.interface';

@Injectable()
export class UserGuard extends BaseGuard<UserEntity> {
	protected guardTypes: EGuardType[] = [EGuardType.USER];

	protected getUser(jwtPayload: IJwtPayload): Promise<UserEntity> {
		return getRepository(UserEntity).findOne({
			where: { id: jwtPayload.userId, isVerified: true },
			select: ['id', 'uid', 'isBlocked', 'lastUpdatePrivacy'],
			cache: true, // 10s
		});
	}
}
