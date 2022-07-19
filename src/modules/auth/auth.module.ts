import { Module } from '@nestjs/common';

import { CustomRepositoryModule } from '@core/repository';

import { MailModule } from '@modules/mail/mail.module';
import { UserModule } from '@modules/user/user.module';
import { UserRepository } from '@modules/user/user.repository';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthModule } from './jwt-auth/jwt-auth.module';
import LoginOptions from './login-options';

@Module({
	imports: [
		CustomRepositoryModule.forFeature([UserRepository]),
		MailModule,
		UserModule,
		JwtAuthModule,
		...LoginOptions,
	],
	providers: [AuthService],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
