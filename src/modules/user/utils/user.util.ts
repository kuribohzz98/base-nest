import { randomBytes } from 'crypto';

export function randomUidUser() {
	return randomBytes(8).toString('hex');
}
