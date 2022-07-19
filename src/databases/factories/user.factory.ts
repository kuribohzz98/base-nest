import { setSeederFactory } from 'typeorm-extension';

import { UserEntity } from '@entities/user.entity';

import { randomUidUser } from '@modules/user/utils/user.util';

export default setSeederFactory(UserEntity, () => {
	const user = new UserEntity();
	user.uid = randomUidUser();

	return user;
});
