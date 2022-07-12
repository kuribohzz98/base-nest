import { randomBytes } from 'crypto';
import { stringify } from 'querystring';

import { HOUR } from '@constants/time.constant';

import { ESendMailAuthContext } from './auth.constant';

function getExpriedTimeVerifyUrl() {
	return Date.now() + 1 * HOUR;
}

export function generateVerifyUrl(url: string, uid: string, email: string, context: ESendMailAuthContext) {
	const parsedUrlQueryInput = {
		timeVerify: Date.now(),
		email,
		context,
		uid,
		token: randomBytes(30).toString('hex'),
		expriedTime: getExpriedTimeVerifyUrl(),
	};

	const params = stringify(parsedUrlQueryInput);

	return { link: `${url}?${params}`, query: parsedUrlQueryInput };
}

export function getUrlVerifyRegister(clientUrl: string) {
	return `${clientUrl}/auth/register/verify`;
}

export function getUrlVerifyForgotPassword(clientUrl: string) {
	return `${clientUrl}/auth/forgot-password/verify`;
}
