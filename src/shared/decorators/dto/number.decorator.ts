import { Transform } from 'class-transformer';
import { IsInt, IsNumber, Max, Min } from 'class-validator';

import DtoDecoratorNP from './dto.decorator';

interface IDtoDecoratorNumberOption extends DtoDecoratorNP.IDtoOptionsInitDecorators {
	min?: number;
	max?: number;
	transformToNumber?: boolean; // with param in api, convert string to number
}

function transformToNumber(each: boolean) {
	return Transform(({ value }: { value: string | string[] }) => {
		if (!value) return value;
		if (!each) return +value;
		if (Array.isArray(value)) {
			return (value as string[]).map(value => +value);
		}
		return [+value];
	});
}

function addNumberOption(decorators: PropertyDecorator[], options?: IDtoDecoratorNumberOption) {
	if (typeof options?.max === 'number') decorators.push(Max(options.max, { each: options?.each }));
	if (typeof options?.max === 'number') decorators.push(Min(options.min, { each: options?.each }));
	if (options?.transformToNumber) {
		decorators.push(transformToNumber(options?.each));
	}
	return decorators;
}

export function DtoNumber(options?: IDtoDecoratorNumberOption) {
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) =>
		addNumberOption(decorators, options).push(IsNumber(undefined, { each: options?.each })),
	);
}

export function DtoInt(options?: IDtoDecoratorNumberOption) {
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) =>
		addNumberOption(decorators, options).push(IsInt({ each: options?.each })),
	);
}

export function DtoId(options?: Omit<IDtoDecoratorNumberOption, 'min'>) {
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) =>
		addNumberOption(decorators, { ...options, min: 1 }).push(IsInt({ each: options?.each })),
	);
}
