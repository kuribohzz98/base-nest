import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

import DtoDecoratorNP from './dto.decorator';

interface IDtoDecoratorStringOption extends DtoDecoratorNP.IDtoOptionsInitDecorators {
	minLength?: number;
	maxLength?: number;
	matches?: RegExp;
	trim?: boolean;
}

function addStringOption(decorators: PropertyDecorator[], options?: IDtoDecoratorStringOption) {
	if (options?.matches) decorators.push(Matches(options.matches, { each: options?.each }));
	if (typeof options?.maxLength === 'number') decorators.push(MaxLength(options.maxLength, { each: options?.each }));
	if (typeof options?.minLength === 'number') decorators.push(MinLength(options.minLength, { each: options?.each }));
	if (options?.trim) decorators.push(Transform(({ value }: { value: string }) => value?.trim()));
	return decorators;
}

export function DtoString(options?: IDtoDecoratorStringOption) {
	// if (typeof options?.trim === 'undefined') {
	// 	if (!options) options = {};
	// 	options.trim = true;
	// }
	return DtoDecoratorNP.initializeDecorators(options, (decorators: PropertyDecorator[]) =>
		addStringOption(decorators, options).push(IsString({ each: options?.each })),
	);
}
