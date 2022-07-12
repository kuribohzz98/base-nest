import { ApiProperty } from '@nestjs/swagger';

export class LoginResDto {
	@ApiProperty()
	accessToken: string;

	@ApiProperty()
	refreshToken: string;
}

export class RefreshTokenResDto {
	@ApiProperty()
	accessToken: string;
}
