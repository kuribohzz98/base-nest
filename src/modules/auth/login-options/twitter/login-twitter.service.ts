import { HttpService } from '@nestjs/axios';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { catchError, concatMap, from, of } from 'rxjs';

import { EUserType } from '@constants/entity.constant';
import { EGuardType } from '@constants/guard.constant';

import { UserEntity } from '@entities/user.entity';

import { JwtAuthService } from '@modules/auth/jwt-auth/jwt-auth.service';
import { UserRepository } from '@modules/user/user.repository';
import { UserService } from '@modules/user/user.service';

import { AuthException } from '@shared/exceptions/http-exceptions/auth.exception';
import { httpException } from '@shared/exceptions/http.exception';

import LoginTPConfig from '../config/login-third-party.config';
import { ITwitterResponse } from './interfaces/login-twitter.interface';

@Injectable()
export class LoginTwitterService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly httpService: HttpService,
		@Inject(LoginTPConfig.KEY)
		private readonly loginTPConfig: ConfigType<typeof LoginTPConfig>,
		private readonly userRepo: UserRepository,
		private readonly jwtAuthService: JwtAuthService,
		private readonly userService: UserService,
	) {}

	verify(token: string, twitterUserId: string) {
		return this.twitterCall(token, twitterUserId)
			.pipe(
				catchError(err => {
					this.logger.error(err.message);
					httpException(AuthException.LoginThirdParty, 'BAD_REQUEST', 'has-error');
					return of({ data: {} as ITwitterResponse });
				}),
			)
			.pipe(
				concatMap(
					({
						data: {
							data: { id, name, username },
						},
					}) => from(this.verifyUserTwitter(id, name || username)),
				),
				concatMap(user =>
					of(
						this.jwtAuthService.getLoginData(
							user.id,
							user.type === EUserType.USER ? EGuardType.USER : EGuardType.USER,
							user.lastUpdatePrivacy.getTime(),
						),
					),
				),
			);
	}

	private twitterCall(token: string, twitterUserId: string) {
		const host = this.loginTPConfig.twitter.apiUrl;
		return this.httpService.get<ITwitterResponse>(`${host}/${twitterUserId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
	}

	private async verifyUserTwitter(id: string, name: string) {
		const user = await this.userRepo.findOne({ where: { twitterKey: id } });
		return this.verifyThirdParty(user, name, id);
	}

	private async verifyThirdParty(user: UserEntity, name: string, twitterId: string) {
		if (!user) {
			const uid = await this.userService.getUid();
			user = this.userRepo.create({ uid, twitterKey: twitterId, isVerified: true });
			user = await this.userRepo.save(user);
		}
		return user;
	}
}
