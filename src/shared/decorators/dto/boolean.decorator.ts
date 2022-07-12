import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

import { ValidatorException } from '@shared/exceptions/http-exceptions/validator.exception';
import { httpException } from '@shared/exceptions/http.exception';

import DtoDecoratorNP from './dto.decorator';

interface IDtoBooleanDecoratorOption extends DtoDecoratorNP.IDtoDecoratorOption {
	transformToBoolean?: boolean; // with param in api, 1 -> true, 0 -> false, the other is invalid
}

function transformToBoolean(each: boolean) {
	return Transform(({ value }: { value: string | string[] }) => {
		if (each) {
			if (!Array.isArray(value)) {
				if (value !== '1' && value !== '0') {
					httpException(ValidatorException.General, 'BAD_REQUEST', 'require-boolean-string');
				}
				return !!+value;
			}
			const results = [] as boolean[];
			for (const iterator of value as string[]) {
				if (iterator !== '1' && iterator !== '0') {
					httpException(ValidatorException.General, 'BAD_REQUEST', 'require-boolean-string');
				}
				results.push(!!+iterator);
			}
			return results;
		}
		if (value !== '1' && value !== '0') {
			httpException(ValidatorException.General, 'BAD_REQUEST', 'require-boolean-string');
		}
		return !!+value;
	});
}

export function DtoBoolean(options?: IDtoBooleanDecoratorOption) {
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) => {
		if (options?.transformToBoolean) {
			return decorators.push(transformToBoolean(options?.each));
		}
		decorators.push(IsBoolean({ each: options?.each }));
	});
}
