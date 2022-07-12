import { HttpException, HttpStatus } from '@nestjs/common';

type HttpStatusKeys = keyof typeof HttpStatus;

const httpErrorSymbol = Symbol('error:http');

export interface IResponseException {
	context: string;
	type: string;
	message: string;
}

export interface IResponseExceptionDoc extends IResponseException {
	status: number;
}

export namespace ExceptionCustom {
	export interface ITypeException {
		[key: string]: any;
	}

	export function ContextException(context: string) {
		return function (constructor: Function) {
			Reflect.defineMetadata(httpErrorSymbol, context, constructor);
		};
	}
}

export function httpException<T extends ExceptionCustom.ITypeException>(
	TargetClass: new () => T,
	statusCode: HttpStatusKeys,
	type: keyof T,
	details?: { [x: string]: any },
): IResponseException {
	const instance = new TargetClass();
	const message = replaceMessage(instance[type] || '', details);
	throw new HttpException(
		{
			context: Reflect.getMetadata(httpErrorSymbol, TargetClass),
			type,
			message,
		} as IResponseException,
		HttpStatus[statusCode],
	);
}

export function httpExDocResponse<T extends ExceptionCustom.ITypeException>(
	TargetClass: new () => T,
	statusCode: HttpStatusKeys,
	type: keyof T,
): IResponseExceptionDoc {
	const instance = new TargetClass();
	return {
		context: Reflect.getMetadata(httpErrorSymbol, TargetClass),
		type,
		message: instance[type],
		status: HttpStatus[statusCode],
	} as IResponseExceptionDoc;
}

function replaceMessage(message: string, details: { [x: string]: any }) {
	if (!message) return message;
	if (details && Object.keys(details).length) {
		for (const key of Object.keys(details)) {
			const regex = new RegExp(`\\$${key} |\\$${key}$`, 'g');
			message = message.replace(regex, `${details[key]} `);
		}
	}
	return message;
}

export function httpExceptionCustom(data: IResponseException, status: number) {
	throw new HttpException(data, status);
}

export function getExceptionContext(namespace: string, contextName?: string) {
	return namespace + (contextName ? `_${contextName}` : '');
}
