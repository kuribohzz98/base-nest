import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync, hashSync } from 'bcrypt';
import { Equal, Not } from 'typeorm';

import { EUserType } from '@constants/entity.constant';
import { EEnvKey } from '@constants/env.constant';
import { EGuardType } from '@constants/guard.constant';

import { UserEntity } from '@entities/user.entity';

import { MailService } from '@modules/mail/mail.service';
import { UserRepository } from '@modules/user/user.repository';
import { UserService } from '@modules/user/user.service';

import { AuthException } from '@shared/exceptions/http-exceptions/auth.exception';
import { httpException } from '@shared/exceptions/http.exception';
import { IJwtPayload } from '@shared/interfaces/authentication.interface';

import { ChangePasswordBodyDto, LoginBodyDto, RegisterBodyDto, VerifyBodyRequest } from './dtos/auth-request.dto';
import { JwtAuthService } from './jwt-auth/jwt-auth.service';
import { ESendMailAuthContext } from './utils/auth.constant';
import { generateVerifyUrl, getUrlVerifyForgotPassword, getUrlVerifyRegister } from './utils/auth.util';

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepo: UserRepository,
		private readonly configService: ConfigService,
		private readonly mailService: MailService,
		private readonly userService: UserService,
		private readonly jwtAuthService: JwtAuthService,
	) {}

	async refreshJwtToken(refreshToken: string) {
		try {
			const jwtData = this.jwtAuthService.jwtService.verify(refreshToken, {
				secret: this.configService.get(EEnvKey.SECRET_REFRESH_JWT),
				ignoreExpiration: false,
			}) as IJwtPayload;
			const { userId, type, lastUpdatePrivacy } = jwtData as IJwtPayload;
			if (!EGuardType[type]) {
				httpException(AuthException.RefreshToken, 'BAD_REQUEST', 'token-invalid');
			}
			const user = await this.userRepo.findOne({
				where: { id: userId, isVerified: true, isBlocked: Not(Equal(true)) as any },
				select: ['id', 'type', 'lastUpdatePrivacy'],
			});
			if (!user) {
				httpException(AuthException.RefreshToken, 'BAD_REQUEST', 'token-expired');
			}
			if (lastUpdatePrivacy !== user.lastUpdatePrivacy.getTime()) {
				httpException(AuthException.RefreshToken, 'BAD_REQUEST', 'token-expired');
			}
			if (user.type === EUserType.USER && type !== EGuardType.USER) {
				httpException(AuthException.RefreshToken, 'BAD_REQUEST', 'token-expired');
			}
			return {
				accessToken: this.jwtAuthService.jwtService.sign({
					userId: user.id,
					type,
					lastUpdatePrivacy,
				} as IJwtPayload),
			};
		} catch (error) {
			httpException(AuthException.RefreshToken, 'BAD_REQUEST', 'token-expired');
		}
	}

	async login(data: LoginBodyDto) {
		const user = await this.userRepo.findOne({
			where: { email: data.email, isVerified: true },
			select: ['id', 'isBlocked', 'password', 'type', 'lastUpdatePrivacy'],
		});
		if (!user) {
			httpException(AuthException.General, 'BAD_REQUEST', 'incorrect-username-or-password');
		}
		if (user?.isBlocked) {
			httpException(AuthException.General, 'BAD_REQUEST', 'has-been-blocked');
		}
		if (!compareSync(data.password, user.password)) {
			httpException(AuthException.General, 'BAD_REQUEST', 'incorrect-username-or-password');
		}
		return this.jwtAuthService.getLoginData(
			user.id,
			user.type === EUserType.USER ? EGuardType.USER : EGuardType.USER,
			user.lastUpdatePrivacy.getTime(),
		);
	}

	async register(data: RegisterBodyDto) {
		const user = await this.userRepo.findOne({ where: { email: data.email } });

		// register
		if (!user) {
			const pwHashed = this.hashPassword(data.password);
			const uid = await this.userService.getUid();
			const query = this.sendMailVerify(data.email, uid);
			return this.userService.register({ ...data, password: pwHashed, verifyContent: query });
		}

		// override pw, resend mail
		if (!user.isVerified) {
			const pwHashed = this.hashPassword(data.password);
			const query = this.sendMailVerify(data.email, user.uid);
			return this.userRepo.update(user.id, { password: pwHashed, verifyContent: query });
		}

		httpException(AuthException.General, 'BAD_REQUEST', 'email-already');
	}

	async forgotPassword(email: string) {
		const user = await this.userRepo.findOne({ where: { email } });
		if (!user || user?.isVerified) {
			httpException(AuthException.General, 'BAD_REQUEST', 'email-not-use');
		}
		if (user?.isBlocked) {
			httpException(AuthException.General, 'BAD_REQUEST', 'has-been-blocked');
		}
		const query = this.sendMailForgot(email, user.uid);
		return this.userRepo.update(user.id, { verifyContent: query });
	}

	async changePassword(id: number, data: ChangePasswordBodyDto) {
		const user = await this.userRepo.findOne({
			where: { id, isVerified: true },
			select: ['id', 'email', 'isBlocked', 'password', 'type', 'lastUpdatePrivacy'],
		});
		if (!user?.email || !user?.password) {
			httpException(AuthException.ChangePassword, 'FORBIDDEN', 'cant-change-password');
		}
		if (user?.isBlocked) {
			httpException(AuthException.General, 'BAD_REQUEST', 'has-been-blocked');
		}
		if (!compareSync(data.currentPassword, user.password)) {
			httpException(AuthException.ChangePassword, 'BAD_REQUEST', 'current-password-mismatch');
		}
		const pwHashed = this.hashPassword(data.newPassword);
		const lastUpdatePrivacy = new Date();
		await this.userRepo.update(user.id, { password: pwHashed, lastUpdatePrivacy });
		return this.jwtAuthService.getLoginData(
			user.id,
			user.type === EUserType.USER ? EGuardType.USER : EGuardType.USER,
			lastUpdatePrivacy.getTime(),
		);
	}

	async verify(data: VerifyBodyRequest) {
		const user = await this.userRepo.findOne({ where: { email: data.email, uid: data.uid } });
		if (!user?.verifyContent) {
			httpException(AuthException.Verify, 'BAD_REQUEST', 'param-invalid');
		}
		if (Array.isArray(user.verifyContent)) {
			await this.userRepo.update(user.id, { verifyContent: null });
			httpException(AuthException.Verify, 'BAD_REQUEST', 'param-invalid');
		}
		for (const key of Object.keys(user.verifyContent)) {
			if (!data[key] || data[key] !== user.verifyContent[key]) {
				httpException(AuthException.Verify, 'BAD_REQUEST', 'param-invalid');
			}
		}
		if (data?.expriedTime && Date.now() > data.expriedTime) {
			httpException(AuthException.Verify, 'BAD_REQUEST', 'session-expired');
		}

		switch (data.context) {
			case ESendMailAuthContext.VERIFY: {
				return this.verifyRegister(user);
			}

			case ESendMailAuthContext.FORGOT_PASSWORD: {
				return this.verifyForgotPassword(user, data.password);
			}

			default:
				return;
		}
	}

	private async verifyRegister(user: UserEntity) {
		await this.userRepo.update(user.id, {
			isVerified: true,
			verifyContent: null,
			deletedAt: null,
			isBlocked: false,
		});
		// use when login after verify register
		// return this.getLoginData(
		// 	user.id,
		// 	user.type === EUserType.USER ? EGuardType.USER : EGuardType.BUSINESSMAN,
		// 	user.lastUpdatePrivacy,
		// );
	}

	private async verifyForgotPassword(user: UserEntity, newPassword: string) {
		const pwHashed = this.hashPassword(newPassword);
		await this.userRepo.update(user.id, { verifyContent: null, password: pwHashed });
		// use when login after verify forgot password
		// return this.getLoginData(
		// 	user.id,
		// 	user.type === EUserType.USER ? EGuardType.USER : EGuardType.BUSINESSMAN,
		// 	user.lastUpdatePrivacy,
		// );
	}

	private sendMailVerify(email: string, uid: string) {
		const { link, query } = generateVerifyUrl(
			getUrlVerifyRegister(this.configService.get(EEnvKey.CLIENT_URL)),
			uid,
			email,
			ESendMailAuthContext.VERIFY,
		);
		this.mailService.sendRegisterVerify(email, { link });
		return query;
	}

	private sendMailForgot(email: string, uid: string) {
		const { link, query } = generateVerifyUrl(
			getUrlVerifyForgotPassword(this.configService.get(EEnvKey.CLIENT_URL)),
			uid,
			email,
			ESendMailAuthContext.FORGOT_PASSWORD,
		);
		this.mailService.sendForgotPasswordVerify(email, { link });
		return query;
	}

	private hashPassword(password: string) {
		return hashSync(password, 10);
	}
}
