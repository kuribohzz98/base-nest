import { Column, Entity, OneToMany } from 'typeorm';

import { ETableName } from '@constants/entity.constant';

import { BaseEntityIncludeTimeUpdate } from '@core/base.entity';

import { AdminPermissionEntity } from './admin-permission.entity';

@Entity({ name: ETableName.ADMIN_FUNCTION })
export class AdminFunctionEntity extends BaseEntityIncludeTimeUpdate {
	@Column({ type: 'varchar', length: '255' })
	name: string;

	// references

	@OneToMany<AdminPermissionEntity>(() => AdminPermissionEntity, permission => permission.adminFunction)
	adminPermissions: AdminPermissionEntity[];
}
