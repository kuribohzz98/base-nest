import { existsSync } from 'fs';
import { join } from 'path';

import { EnvFilePath } from '@constants/env.constant';

export function getAlreadyExistsEnvFile() {
	for (const iterator of EnvFilePath) {
		if (existsSync(join(__dirname, '../../../', iterator))) {
			return iterator;
		}
	}
}
