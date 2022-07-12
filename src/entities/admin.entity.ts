import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { EAdminType, EGender, ETableName } from '@constants/entity.constant';

import { BaseEntityIncludeTime } from '@core/base.entity';

import { IVerifyContent } from '@shared/interfaces/entity.interface';

import { AdminRoleEntity } from './admin-role.entity';

@Entity({ name: ETableName.ADMIN })
export class AdminEntity extends BaseEntityIncludeTime {
	@Column({ type: 'varchar', length: '255', nullable: true })
	email: string;

	@Column({ type: 'varchar', length: '255', nullable: true })
	password: string;

	@Column({ type: 'tinyint', width: 1, nullable: true })
	type: EAdminType;

	@Column({ name: 'role_id', type: 'int', width: 11, nullable: true })
	roleId: number;

	@Column({ type: 'varchar', length: '100', nullable: true })
	name: string;

	@Column({ type: 'tinyint', width: 1, nullable: true })
	gender: EGender;

	@Column({ name: 'phone_number', type: 'varchar', length: '15', nullable: true })
	phoneNumber: string;

	@Column({ name: 'is_blocked', type: 'boolean', default: false })
	isBlocked: boolean;

	@Column({ name: 'last_update_privacy', type: 'timestamp', nullable: true })
	lastUpdatePrivacy: Date;

	@Column({ name: 'verify_content', type: 'json', nullable: true })
	verifyContent: IVerifyContent;

	// references

	@ManyToOne(() => AdminRoleEntity, adminRole => adminRole.admins)
	@JoinColumn({ name: 'role_id' })
	adminRole: AdminRoleEntity;
}
