import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { EGuardType } from '@constants/guard.constant';

import { BaseGuard } from '@core/base.guard';

import { UserEntity } from '@entities/user.entity';

import { IJwtPayload } from '@shared/interfaces/authentication.interface';

@Injectable()
export class BusinessmanGuard extends BaseGuard<UserEntity> {
	protected guardTypes: EGuardType[] = [EGuardType.BUSINESSMAN];

	protected getUser(jwtPayload: IJwtPayload): Promise<UserEntity> {
		return getRepository(UserEntity).findOne(
			{ id: jwtPayload.userId, isVerified: true },
			{
				select: ['id', 'uid', 'isBlocked', 'lastUpdatePrivacy'],
				cache: 10000, // 10s
			},
		);
	}
}
