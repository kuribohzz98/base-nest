import { Column, Entity, OneToOne } from 'typeorm';

import { ETableName, EUserType } from '@constants/entity.constant';

import { BaseEntityIncludeTime } from '@core/base.entity';

import { IVerifyContent } from '@shared/interfaces/entity.interface';

import { UserInfoEntity } from './user-info.entity';

@Entity({ name: ETableName.USER })
export class UserEntity extends BaseEntityIncludeTime {
	@Column({ type: 'varchar', length: '20' })
	uid: string;

	@Column({ type: 'tinyint', width: 1, default: EUserType.USER })
	type: EUserType;

	@Column({ name: 'is_verified', type: 'boolean', default: false })
	isVerified: boolean;

	@Column({ name: 'is_blocked', type: 'boolean', default: false })
	isBlocked: boolean;

	@Column({ type: 'varchar', length: '255', nullable: true })
	email: string;

	@Column({ type: 'varchar', length: '255', nullable: true })
	password: string;

	@Column({ name: 'facebook_key', type: 'varchar', length: '100', nullable: true })
	facebookKey: string;

	@Column({ name: 'google_key', type: 'varchar', length: '100', nullable: true })
	googleKey: string;

	@Column({ name: 'twitter_key', type: 'varchar', length: '100', nullable: true })
	twitterKey: string;

	@Column({ name: 'last_update_privacy', type: 'timestamp', nullable: true })
	lastUpdatePrivacy: Date;

	@Column({ name: 'verify_content', type: 'json', nullable: true })
	verifyContent: IVerifyContent;

	// references

	@OneToOne(() => UserInfoEntity, userInfo => userInfo.user)
	userInfo: UserInfoEntity;
}
