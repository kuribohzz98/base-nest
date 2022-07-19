import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { EGender, ETableName } from '@constants/entity.constant';

import { BaseEntityIncludeTimeUpdate } from '@core/base.entity';

import { UserEntity } from './user.entity';

@Entity({ name: ETableName.USER_INFO })
export class UserInfoEntity extends BaseEntityIncludeTimeUpdate {
	@Column({ name: 'user_id', type: 'int', width: 11 })
	userId: number;

	@Column({ name: 'first_name', type: 'varchar', length: '100' })
	firstName: string;

	@Column({ name: 'last_name', type: 'varchar', length: '100' })
	lastName: string;

	@Column({ type: 'tinyint', width: 1, nullable: true })
	gender: EGender;

	@Column({ name: 'phone_number', type: 'varchar', length: '15', nullable: true })
	phoneNumber: string;

	// references

	@OneToOne(() => UserEntity, user => user.userInfo)
	@JoinColumn({ name: 'user_id' })
	user: UserEntity;
}
