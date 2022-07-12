import { ETableName } from '@constants/entity.constant';

import { AdminFunctionEntity } from './admin-function.entity';
import { AdminPermissionEntity } from './admin-permission.entity';
import { AdminRoleEntity } from './admin-role.entity';
import { AdminEntity } from './admin.entity';
import { UserInfoEntity } from './user-info.entity';
import { UserEntity } from './user.entity';

export class EntityAttribute implements Record<ETableName, string[]> {
	[ETableName.USER]: (keyof UserEntity)[];
	[ETableName.USER_INFO]: (keyof UserInfoEntity)[];
	[ETableName.ADMIN]: (keyof AdminEntity)[];
	[ETableName.ADMIN_FUNCTION]: (keyof AdminFunctionEntity)[];
	[ETableName.ADMIN_PERMISSION]: (keyof AdminPermissionEntity)[];
	[ETableName.ADMIN_ROLE]: (keyof AdminRoleEntity)[];
}
