import { Body, Controller } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginResDto } from '@modules/auth/dtos/auth-response.dto';

import { HttpPost } from '@shared/decorators/controller/http-methods.decorator';
import { DtoString } from '@shared/decorators/dto/string.decorator';

import { LoginTwitterService } from './login-twitter.service';

class LoginTwitterBodyDto {
	@DtoString()
	token: string;

	@DtoString()
	id: string;
}

@Controller('auth')
@ApiTags('Auth')
export class LoginTwitterController {
	constructor(private readonly loginTwitterService: LoginTwitterService) {}

	@HttpPost('login-twitter', { isPublic: true })
	@ApiOkResponse({ type: LoginResDto })
	loginTwitter(@Body() body: LoginTwitterBodyDto) {
		return this.loginTwitterService.verify(body.token, body.id);
	}
}
