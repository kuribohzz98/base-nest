import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

import DtoDecoratorNP from './dto.decorator';

export function DtoEmail(options?: DtoDecoratorNP.IDtoDecoratorOption) {
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) => {
		decorators.push(
			IsEmail(undefined, { each: options?.each }),
			Transform(({ value }: { value: string }) => value?.trim()?.toLowerCase()),
		);
	});
}
