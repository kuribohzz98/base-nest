import { ETableName } from '@constants/entity.constant';

import { BaseRepository } from '@core/base.repository';
import { EntityRepo } from '@core/repository';

import { UserEntity } from '@entities/user.entity';

@EntityRepo(UserEntity)
export class UserRepository extends BaseRepository<UserEntity> {
	protected alias: ETableName = ETableName.USER;
}
