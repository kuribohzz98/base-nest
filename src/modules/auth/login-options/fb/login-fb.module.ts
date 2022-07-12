import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtAuthModule } from '@modules/auth/jwt-auth/jwt-auth.module';
import { UserModule } from '@modules/user/user.module';
import { UserRepository } from '@modules/user/user.repository';

import loginTPConfig from './../config/login-third-party.config';
import { LoginFbController } from './login-fb.controller';
import { LoginFbService } from './login-fb.service';

@Module({
	imports: [
		HttpModule,
		ConfigModule.forFeature(loginTPConfig),
		TypeOrmModule.forFeature([UserRepository]),
		JwtAuthModule,
		UserModule,
	],
	providers: [LoginFbService],
	controllers: [LoginFbController],
})
export class LoginFbModule {}
