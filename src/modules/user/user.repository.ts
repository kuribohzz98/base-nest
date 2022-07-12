import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { ETableName } from '@constants/entity.constant';

import { BaseRepository } from '@core/base.repository';

import { UserEntity } from '@entities/user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
	protected alias: ETableName = ETableName.USER;
}
