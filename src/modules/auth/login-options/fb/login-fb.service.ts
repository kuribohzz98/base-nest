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

import LoginTPConfig from './../config/login-third-party.config';
import { IFacebookResponse } from './interfaces/login-fb.interface';

@Injectable()
export class LoginFbService {
	private readonly logger = new Logger(this.constructor.name);

	constructor(
		private readonly httpService: HttpService,
		@Inject(LoginTPConfig.KEY)
		private readonly loginTPConfig: ConfigType<typeof LoginTPConfig>,
		private readonly userRepo: UserRepository,
		private readonly jwtAuthService: JwtAuthService,
		private readonly userService: UserService,
	) {}

	facebookVerify(token: string) {
		return this.facebookCall(token)
			.pipe(
				catchError(err => {
					this.logger.error(err.message);
					httpException(AuthException.LoginThirdParty, 'BAD_REQUEST', 'has-error');
					return of({ data: {} as IFacebookResponse });
				}),
			)
			.pipe(
				concatMap(({ data: { id, name, email } }) => from(this.verifyUserFacebook(id, name, email))),
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

	private facebookCall(token: string) {
		const host = this.loginTPConfig.fb.apiUrl;
		return this.httpService.get<IFacebookResponse>(host, {
			params: { fields: 'id,name,email', ['access_token']: token },
		});
	}

	private async verifyUserFacebook(id: number, name: string, email: string) {
		const user = await this.userRepo.findOne({ where: { facebookKey: id && `${id}` } });
		return this.verifyThirdParty(user, name, email, id);
	}

	private async verifyThirdParty(user: UserEntity, name: string, email: string, fbId: number) {
		if (!user) {
			if (await this.userService.checkEmailAlreadyExists(email)) {
				httpException(AuthException.General, 'CONFLICT', 'email-already');
			}
			const uid = await this.userService.getUid();
			user = this.userRepo.create({ uid, email, facebookKey: fbId && `${fbId}`, isVerified: true });
			user = await this.userRepo.save(user);
		}
		return user;
	}
}
