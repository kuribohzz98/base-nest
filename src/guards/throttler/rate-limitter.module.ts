import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';

import { EEnvKey } from '@constants/env.constant';

import { HttpThrottlerGuard } from './http-throttler.guard';

@Module({
	imports: [
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				ttl: config.get<number>(EEnvKey.RATE_LIMITTER_TTL) || 1,
				limit: config.get<number>(EEnvKey.RATE_LIMITTER_LIMIT) || 10,
			}),
		}),
	],
	providers: [
		{
			provide: APP_GUARD,
			useClass: HttpThrottlerGuard,
		},
	],
})
export class RateLimitterModule {}
