import { IsEnum } from 'class-validator';

import DtoDecoratorNP from './dto.decorator';

export function DtoEnum(entity: object, options?: DtoDecoratorNP.IDtoDecoratorOption) {
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) => {
		decorators.push(IsEnum(entity, { each: options?.each }));
	});
}
