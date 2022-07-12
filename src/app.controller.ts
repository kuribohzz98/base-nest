import { Controller } from '@nestjs/common';

import { HttpGet } from '@shared/decorators/controller/http-methods.decorator';

import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@HttpGet('', { isPublic: true })
	getHello() {
		return this.appService.getHello();
	}
}
