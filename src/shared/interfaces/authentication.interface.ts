import { EGuardType } from '@constants/guard.constant';

export interface IJwtPayload {
	userId: number;
	type: EGuardType;
	lastUpdatePrivacy?: number;
	roles?: number[];
}
