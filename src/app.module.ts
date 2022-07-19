import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CustomConfigModule } from '@configs/config.module';

import { TransactionExecutorModule } from '@core/transaction';

import { RateLimitterModule } from '@guards/throttler/rate-limitter.module';

import { LoggerHttpRequestMiddleware } from '@shared/middleware/logger-http-request.middleware';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthenticationModule } from './authentication/authentication.module';
import { MySQLModule } from './databases/mysql.module';
import { MODULES } from './modules';

@Module({
	imports: [
		CustomConfigModule,
		RateLimitterModule,
		AuthenticationModule,
		MySQLModule,
		TransactionExecutorModule.forRoot(),
		...MODULES,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerHttpRequestMiddleware).forRoutes('*');
	}
}
