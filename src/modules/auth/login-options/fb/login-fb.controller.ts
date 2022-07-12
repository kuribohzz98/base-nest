import { Body, Controller } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginResDto } from '@modules/auth/dtos/auth-response.dto';

import { HttpPost } from '@shared/decorators/controller/http-methods.decorator';
import { DtoString } from '@shared/decorators/dto/string.decorator';

import { LoginFbService } from './login-fb.service';

class LoginFbBodyDto {
	@DtoString()
	token: string;
}

@Controller('auth')
@ApiTags('Auth')
export class LoginFbController {
	constructor(private readonly loginFbService: LoginFbService) {}

	@HttpPost('login-fb', { isPublic: true })
	@ApiOkResponse({ type: LoginResDto })
	loginFb(@Body() body: LoginFbBodyDto) {
		return this.loginFbService.facebookVerify(body.token);
	}
}
