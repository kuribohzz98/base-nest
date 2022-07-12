import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

function httpRequestLoggerBuilder(req: Request): string {
	const param = `\n param: ${JSON.stringify(req.params)}`;
	const query = `\n query: ${JSON.stringify(req.query)}`;
	const body = req.method === 'POST' || req.method === 'PUT' ? `\n body: ${JSON.stringify(req.body)}` : '';
	const logger = `[${req.method} - ${req.baseUrl}]: ${param} ${query} ${body}`;
	return logger;
}

@Injectable()
export class LoggerHttpRequestMiddleware implements NestMiddleware {
	private readonly logger = new Logger(LoggerHttpRequestMiddleware.name);

	use(req: Request, res: Response, next: NextFunction) {
		this.logger.log(httpRequestLoggerBuilder(req));
		next();
	}
}
