import { EContextException } from '@constants/exeption.constant';

import { ExceptionCustom, getExceptionContext } from '../http.exception';

export namespace FileException {
	@ExceptionCustom.ContextException(getExceptionContext(EContextException.FILE, 'UPLOAD'))
	export class UploadFile implements ExceptionCustom.ITypeException {
		'file-invalid' = 'File is invalid';
		'gif-too-large' = 'Gif file must be less than equal $size';
	}
}
