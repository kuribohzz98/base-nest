import { randomBytes } from 'crypto';

export function randomHex(byte: number) {
	return randomBytes(byte).toString('hex');
}
