import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { envValidate } from './env.validation';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: ['.env.production', '.env.development', '.env'], // If a variable is found in multiple files, the first one takes precedence.
			validate: envValidate,
		}),
	],
	providers: [ConfigService],
	exports: [ConfigService],
})
export class CustomConfigModule {}
