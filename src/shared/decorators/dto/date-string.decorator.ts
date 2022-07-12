import { IsDateString } from 'class-validator';

import DtoDecoratorNP from './dto.decorator';

export function DtoDatetime(options?: DtoDecoratorNP.IDtoDecoratorOption) {
	return DtoDecoratorNP.initializeDecorators({ ...options, propertyType: Date }, (decorators: PropertyDecorator[]) =>
		decorators.push(IsDateString(undefined, { each: options?.each })),
	);
}
