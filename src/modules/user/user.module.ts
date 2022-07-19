import { Module } from '@nestjs/common';

import { CustomRepositoryModule } from '@core/repository';

import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
	imports: [CustomRepositoryModule.forFeature([UserRepository])],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
