import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';

import { EGuardType } from '@constants/guard.constant';

import { BaseGuard } from '@core/base.guard';

import { AdminEntity } from '@entities/admin.entity';

import { IJwtPayload } from '@shared/interfaces/authentication.interface';

@Injectable()
export class AdminGuard extends BaseGuard<AdminEntity> {
	protected guardTypes: EGuardType[] = [EGuardType.ADMIN];

	protected getUser(jwtPayload: IJwtPayload): Promise<AdminEntity> {
		return getRepository(AdminEntity).findOne(
			{ id: jwtPayload.userId },
			{
				select: ['id', 'isBlocked', 'lastUpdatePrivacy'],
				cache: 10000, // 10s
			},
		);
	}
}
