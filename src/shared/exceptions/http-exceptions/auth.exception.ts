import { EContextException } from '@constants/exeption.constant';

import { ExceptionCustom, getExceptionContext } from '../http.exception';

export namespace AuthException {
	@ExceptionCustom.ContextException(getExceptionContext(EContextException.AUTH))
	export class General implements ExceptionCustom.ITypeException {
		'incorrect-username-or-password' = 'Incorrect username or password';
		'has-been-blocked' = 'This account has been locked';
		'email-already' = 'Email already in use';
		'email-not-use' = 'Email is not in use';
	}

	@ExceptionCustom.ContextException(getExceptionContext(EContextException.AUTH, 'JWT'))
	export class RefreshToken implements ExceptionCustom.ITypeException {
		'token-invalid' = 'Token invalid';
		'token-expired' = 'Token expried';
	}

	@ExceptionCustom.ContextException(getExceptionContext(EContextException.AUTH, 'VERIFY'))
	export class Verify implements ExceptionCustom.ITypeException {
		'param-invalid' = 'Verification failed due to error param invalid';
		'session-expired' = 'Verification failed due to error session expried';
	}

	@ExceptionCustom.ContextException(getExceptionContext(EContextException.AUTH, 'CHANGE_PASSWORD'))
	export class ChangePassword implements ExceptionCustom.ITypeException {
		'cant-change-password' = 'Require account created by email';
		'current-password-mismatch' = 'Current password does not match';
	}

	@ExceptionCustom.ContextException(getExceptionContext(EContextException.AUTH, 'LOGIN_THIRD_PARTY'))
	export class LoginThirdParty implements ExceptionCustom.ITypeException {
		'has-error' = 'Some thing went wrong';
	}

	@ExceptionCustom.ContextException(getExceptionContext(EContextException.AUTH, 'GUARD'))
	export class Guard implements ExceptionCustom.ITypeException {
		'account-not-exist' = "Account doesn't exist";
		'account-blocked' = 'Account has been blocked';
		'wrong-token' = 'Wrong token';
	}
}
