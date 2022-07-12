import { Column, Entity, OneToMany } from 'typeorm';

import { ETableName } from '@constants/entity.constant';

import { BaseEntityIncludeTime } from '@core/base.entity';

import { AdminPermissionEntity } from './admin-permission.entity';
import { AdminEntity } from './admin.entity';

@Entity({ name: ETableName.ADMIN_ROLE })
export class AdminRoleEntity extends BaseEntityIncludeTime {
	@Column({ type: 'varchar', length: '255' })
	name: string;

	// references

	@OneToMany(() => AdminEntity, admin => admin.adminRole)
	admins: AdminEntity[];

	@OneToMany<AdminPermissionEntity>(() => AdminPermissionEntity, permission => permission.adminRole)
	adminPermissions: AdminPermissionEntity[];
}
