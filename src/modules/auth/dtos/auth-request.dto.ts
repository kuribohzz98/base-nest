import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';

import { DtoEmail } from '@shared/decorators/dto/email.decorator';
import { DtoInt } from '@shared/decorators/dto/number.decorator';
import { DtoString } from '@shared/decorators/dto/string.decorator';
import { IVerifyContent } from '@shared/interfaces/entity.interface';

import { ESendMailAuthContext } from '../utils/auth.constant';

export class LoginBodyDto {
	@DtoEmail()
	email: string;

	@DtoString()
	password: string;
}

export class RegisterBodyDto {
	@DtoEmail()
	email: string;

	@DtoString()
	password: string;
}

export class RefreshTokenBodyDto {
	@DtoString()
	refreshToken: string;
}

export class VerifyBodyRequest implements IVerifyContent {
	@DtoInt({ min: 0 })
	timeVerify: number;

	@DtoEmail()
	email: string;

	@DtoString()
	context: ESendMailAuthContext;

	@DtoString()
	uid: string;

	@DtoString()
	token: string;

	@DtoInt({ min: 0 })
	expriedTime: number;

	@ApiProperty({ required: false })
	@IsString()
	@IsNotEmpty()
	@ValidateIf((o: VerifyBodyRequest) => o.context === ESendMailAuthContext.FORGOT_PASSWORD)
	password: string; // require in forgot password
}

export class ForgotPasswordBodyDto {
	@DtoEmail()
	email: string;
}

export class ChangePasswordBodyDto {
	@DtoString()
	currentPassword: string;

	@DtoString()
	newPassword: string;
}
