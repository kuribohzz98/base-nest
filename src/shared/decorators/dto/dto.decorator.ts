import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

namespace DtoDecoratorNP {
	export interface IDtoDecoratorOption {
		optional?: boolean;
		expose?: boolean;
		each?: boolean; // Specifies if validated value is an array and each of its items must be validated.
	}

	export interface IDtoOptionsInitDecorators extends IDtoDecoratorOption {
		propertyType?: string | Function | [Function] | Record<string, any>;
	}

	export function initializeDecorators(
		options: IDtoOptionsInitDecorators,
		additionMiddle: (decorators: PropertyDecorator[]) => any,
	) {
		const ApiPropertyOpts = {} as ApiPropertyOptions;
		if (options?.optional) {
			ApiPropertyOpts.required = false;
		}
		if (options?.propertyType) {
			ApiPropertyOpts.type = options.propertyType;
		}
		const decorators = [ApiProperty(ApiPropertyOpts)];
		if (options?.expose) {
			decorators.push(Expose());
		}
		additionMiddle(decorators);
		if (options?.each) {
			decorators.push(IsArray());
		}
		if (options?.optional) {
			decorators.push(IsOptional({ each: options?.each }));
		} else {
			decorators.push(IsNotEmpty({ each: options?.each }));
		}
		return applyDecorators(...decorators);
	}
}

export default DtoDecoratorNP;

export function DtoProp(expose?: boolean, options?: ApiPropertyOptions) {
	return applyDecorators(ApiProperty(options), ...(expose ? [Expose()] : []));
}
