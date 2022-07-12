import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { EGuardType } from '@constants/guard.constant';

import { AuthException } from '@shared/exceptions/http-exceptions/auth.exception';
import { httpException } from '@shared/exceptions/http.exception';
import { IJwtPayload } from '@shared/interfaces/authentication.interface';

type TRequireForGuard = { lastUpdatePrivacy: Date; isBlocked?: boolean };

export abstract class BaseGuard<U extends TRequireForGuard, A extends TRequireForGuard = U> implements CanActivate {
	protected abstract guardTypes: EGuardType[];

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const { user } = context.switchToHttp().getRequest() as Request;

		if (!this.isPassType(user.type)) return false;

		const userData = await this.getUser(user);
		// check found account
		if (!userData) httpException(AuthException.Guard, 'FORBIDDEN', 'account-not-exist');

		// check last update privacy
		if (userData.lastUpdatePrivacy instanceof Date) {
		}
		if (userData.lastUpdatePrivacy) {
			try {
				if (new Date(userData.lastUpdatePrivacy).getTime() !== user.lastUpdatePrivacy) {
					httpException(AuthException.Guard, 'FORBIDDEN', 'wrong-token');
				}
			} catch (error) {
				httpException(AuthException.Guard, 'FORBIDDEN', 'wrong-token');
			}
		}

		// check blocked
		if (userData.isBlocked) httpException(AuthException.Guard, 'FORBIDDEN', 'account-blocked');

		this.handleMore(user, userData);

		return !!userData;
	}

	private isPassType(type: EGuardType) {
		return this.guardTypes.includes(type);
	}

	// handle more if need
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected handleMore(jwtPayload: IJwtPayload, userData: U | A): any {
		return;
	}

	protected abstract getUser(jwtPayload: IJwtPayload): Promise<U | A>;
}
