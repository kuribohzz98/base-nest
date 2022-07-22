import { OrmIsolation, OrmTransaction, TransactionAction } from '@core/transaction';

import { UserInfoEntity } from '@entities/user-info.entity';
import { UserEntity } from '@entities/user.entity';

type TransactionResult = {
	user: UserEntity;
};

@OrmIsolation('SERIALIZABLE')
export class CreateUserTrans extends OrmTransaction<TransactionResult> {
	constructor(private readonly data: { uid: string; firstName: string; lastName: string }) {
		super();
	}

	@TransactionAction('user')
	private createUser() {
		return this.manager.save(UserEntity, { uid: this.data.uid });
	}

	@TransactionAction()
	private createUserInfo() {
		return this.manager.insert(UserInfoEntity, {
			firstName: this.data.firstName,
			lastName: this.data.lastName,
			userId: this.result.user.id,
		});
	}
}
