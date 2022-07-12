import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EEnvKey } from '@constants/env.constant';

import { JwtStrategy } from './jwt.strategy';

@Module({
	imports: [
		PassportModule.register({ defaultStrategy: 'jwt' }),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) =>
				({
					secret: configService.get(EEnvKey.SECRET_JWT),
					signOptions: {
						expiresIn: '1d',
					},
				} as JwtModuleOptions),
			inject: [ConfigService],
		}),
	],
	providers: [JwtStrategy],
	exports: [JwtModule],
})
export class AuthenticationModule {}
