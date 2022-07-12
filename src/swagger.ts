import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
	.setTitle('API')
	.setDescription('API description')
	.setVersion('1.0')
	.addTag('api')
	.addBearerAuth()
	.build();

export function initSwagger(app: INestApplication, path?: string) {
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup(path || 'docs', app, document);
}
