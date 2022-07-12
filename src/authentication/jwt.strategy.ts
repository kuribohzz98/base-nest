import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { EEnvKey } from '@constants/env.constant';

import { IJwtPayload } from '@shared/interfaces/authentication.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(public readonly configService: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get(EEnvKey.SECRET_JWT),
		});
	}

	async validate(payload: IJwtPayload) {
		return payload;
	}
}
