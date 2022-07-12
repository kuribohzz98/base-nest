import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import * as md5 from 'md5';

@Injectable()
export class HttpThrottlerGuard extends ThrottlerGuard {
	private readonly logger = new Logger(HttpThrottlerGuard.name);

	async handleRequest(context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
		const { req, res } = this.getRequestResponse(context);
		if (Array.isArray(this.options.ignoreUserAgents)) {
			for (const pattern of this.options.ignoreUserAgents) {
				if (pattern.test(req.headers['user-agent'])) {
					return true;
				}
			}
		}
		const tracker = req.headers['x-forwarded-for'] || req.ip;
		const key = this.generateKeyStore(req.originalUrl, tracker);
		this.logger.log(tracker);
		const ttls = await this.storageService.getRecord(key);
		const nearestExpiryTime = ttls.length > 0 ? Math.ceil((ttls[0] - Date.now()) / 1000) : 0;

		if (ttls.length >= limit) {
			res.header('Retry-After', nearestExpiryTime);
			this.throwThrottlingException(context);
		}
		res.header(`${this.headerPrefix}-Limit`, limit);
		res.header(`${this.headerPrefix}-Remaining`, Math.max(0, limit - (ttls.length + 1)));
		res.header(`${this.headerPrefix}-Reset`, nearestExpiryTime);
		await this.storageService.addRecord(key, ttl);
		return true;
	}

	private generateKeyStore(originalUrl: string, suffix: string) {
		return md5(`${suffix}-${originalUrl}`);
	}
}
