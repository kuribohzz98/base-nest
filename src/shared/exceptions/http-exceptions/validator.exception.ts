import { EContextException } from '@constants/exeption.constant';

import { ExceptionCustom, getExceptionContext } from '../http.exception';

export namespace ValidatorException {
	@ExceptionCustom.ContextException(getExceptionContext(EContextException.VALIDATOR))
	export class General implements ExceptionCustom.ITypeException {
		'require-boolean-string' = 'This value must be 0 or 1';
	}
}
