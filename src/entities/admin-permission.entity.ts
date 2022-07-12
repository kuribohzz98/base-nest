import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { EPermission, ETableName } from '@constants/entity.constant';

import { BaseEntityIncludeTimeUpdate } from '@core/base.entity';

import { AdminFunctionEntity } from './admin-function.entity';
import { AdminRoleEntity } from './admin-role.entity';

@Entity({ name: ETableName.ADMIN_PERMISSION })
export class AdminPermissionEntity extends BaseEntityIncludeTimeUpdate {
	@Column({ name: 'role_id', type: 'int', width: 11 })
	roleId: number;

	@Column({ name: 'function_id', type: 'int', width: 11 })
	functionId: number;

	@Column({ type: 'tinyint', width: 1 })
	permission: EPermission;

	// references

	@ManyToOne<AdminRoleEntity>(() => AdminRoleEntity, adminRole => adminRole.adminPermissions)
	@JoinColumn({ name: 'role_id' })
	adminRole: AdminRoleEntity;

	@ManyToOne<AdminFunctionEntity>(() => AdminFunctionEntity, adminFunction => adminFunction.adminPermissions)
	@JoinColumn({ name: 'function_id' })
	adminFunction: AdminFunctionEntity;
}
