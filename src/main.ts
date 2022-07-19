import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { EEnvKey } from '@constants/env.constant';

import { AppModule } from './app.module';
import { initSwagger } from './swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const configService = app.get(ConfigService);

	app.setGlobalPrefix(configService.get<string>(EEnvKey.GLOBAL_PREFIX) || 'api');
	app.enableCors({
		methods: '*',
		allowedHeaders: ['authorization'],
		origin: '*',
	});

	// Swagger
	if (configService.get<string>(EEnvKey.SWAGGER_PATH)) {
		initSwagger(app, configService.get<string>(EEnvKey.SWAGGER_PATH));
	}
	await app.listen(configService.get<string>(EEnvKey.PORT) || 3000);
}
bootstrap();
