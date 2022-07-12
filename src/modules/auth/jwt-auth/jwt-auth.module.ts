import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'authentication/authentication.module';

import { JwtAuthService } from './jwt-auth.service';

@Module({
	imports: [AuthenticationModule],
	providers: [JwtAuthService],
	exports: [JwtAuthService],
})
export class JwtAuthModule {}
