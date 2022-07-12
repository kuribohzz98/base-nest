import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { EEnvKey } from '@constants/env.constant';
import { EGuardType } from '@constants/guard.constant';

import { IJwtPayload } from '@shared/interfaces/authentication.interface';

@Injectable()
export class JwtAuthService {
	constructor(readonly jwtService: JwtService, private readonly configService: ConfigService) {}

	getLoginData(userId: number, type: EGuardType, lastUpdatePrivacy?: number) {
		const payload = { userId, type, lastUpdatePrivacy } as IJwtPayload;
		const accessToken = this.jwtService.sign(payload);
		const refreshToken = this.getRefreshToken(payload);
		return {
			accessToken,
			refreshToken,
		};
	}

	private getRefreshToken(payload: IJwtPayload) {
		const refreshSecretKey = this.configService.get<string>(EEnvKey.SECRET_REFRESH_JWT);
		return this.jwtService.sign(payload, {
			secret: refreshSecretKey,
			expiresIn: '30d',
		});
	}
}
