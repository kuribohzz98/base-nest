import { applyDecorators, Delete, Get, Post, Put, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { EGuardType } from '@constants/guard.constant';

import { JwtGuard } from '@guards/jwt.guard';
import { UserGuard } from '@guards/roles/user.guard';

import { ValidationBodyPipe, ValidationQueryPipe } from '@shared/pipes/validation.pipe';

interface IHttpMethodOptions {
	isPublic?: boolean;
	validateQuery?: boolean;
	guard?: EGuardType;
}

interface IHttpMethodHasBodyOptions extends IHttpMethodOptions {
	exValidateBody?: boolean;
}

function initializeDecorators(options?: IHttpMethodOptions) {
	const optionDecorators = [];

	if (!options?.isPublic) {
		optionDecorators.push(ApiBearerAuth(), UseGuards(JwtGuard));
	}

	if (options?.guard) {
		const guard = getGuard(options.guard);
		if (guard) {
			optionDecorators.push(UseGuards(guard));
		}
	}

	if (options?.validateQuery) {
		optionDecorators.push(UsePipes(ValidationQueryPipe));
	}

	return optionDecorators;
}

function getGuard(type: EGuardType) {
	switch (type) {
		case EGuardType.USER: {
			return UserGuard;
		}
		default:
			return;
	}
}

// HTTP METHOD
export function HttpPost(path?: string | string[], options?: IHttpMethodHasBodyOptions) {
	const optionDecorators = initializeDecorators(options);

	if (!options?.exValidateBody) {
		optionDecorators.push(UsePipes(ValidationBodyPipe));
	}
	return applyDecorators(Post(path), ...optionDecorators);
}

export function HttpPut(path?: string | string[], options?: IHttpMethodHasBodyOptions) {
	const optionDecorators = initializeDecorators(options);

	if (!options?.exValidateBody) {
		optionDecorators.push(UsePipes(ValidationBodyPipe));
	}
	return applyDecorators(Put(path), ...optionDecorators);
}

export function HttpGet(path?: string | string[], options?: IHttpMethodOptions) {
	const optionDecorators = initializeDecorators(options);
	return applyDecorators(Get(path), ...optionDecorators);
}

export function HttpDelete(path?: string | string[], options?: IHttpMethodOptions) {
	const optionDecorators = initializeDecorators(options);
	return applyDecorators(Delete(path), ...optionDecorators);
}
