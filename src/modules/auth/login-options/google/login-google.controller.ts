import { Body, Controller } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { LoginResDto } from '@modules/auth/dtos/auth-response.dto';

import { HttpPost } from '@shared/decorators/controller/http-methods.decorator';
import { DtoString } from '@shared/decorators/dto/string.decorator';

import { LoginGoogleService } from './login-google.service';

class LoginGoogleBodyDto {
	@DtoString()
	token: string;
}

@Controller('auth')
@ApiTags('Auth')
export class LoginGoogleController {
	constructor(private readonly loginGoogleService: LoginGoogleService) {}

	@HttpPost('login-google', { isPublic: true })
	@ApiOkResponse({ type: LoginResDto })
	loginGoogle(@Body() body: LoginGoogleBodyDto) {
		return this.loginGoogleService.verify(body.token);
	}
}
