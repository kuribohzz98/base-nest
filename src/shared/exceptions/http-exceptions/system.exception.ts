import { EContextException } from '@constants/exeption.constant';

import { ExceptionCustom, getExceptionContext } from '../http.exception';

export namespace SystemException {
	@ExceptionCustom.ContextException(getExceptionContext(EContextException.SYSTEM))
	export class General implements ExceptionCustom.ITypeException {
		'pagination-reponse-invalid' = 'Invalid reponse when convert to pagination reponse';
	}
}
