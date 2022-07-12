import { applyDecorators, ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

import { PaginationResponseDto } from '@shared/dtos/base-response.dto';
import { IResponseExceptionDoc } from '@shared/exceptions/http.exception';
import { PaginationReponseInterceptor } from '@shared/interceptors/pagination-response.interceptor';

interface IHttpResponseSuccess extends Omit<ApiResponseOptions, 'status' | 'type'> {
	type: string | Function | [Function];
	status?: 200 | 201;
	addClassSerializer?: boolean;
	isPagination?: boolean;
}

interface IHttpResponse {
	success?: IHttpResponseSuccess;
	exceptions?: IResponseExceptionDoc[];
}

function initializeDecorators(options?: IHttpResponse) {
	const optionDecorators = [];

	if (options?.success) {
		if (options.success?.addClassSerializer) {
			optionDecorators.push(UseInterceptors(ClassSerializerInterceptor));
		}
		if (!options.success.status) {
			options.success.status = 200;
		}
		const apiResOpts: ApiResponseOptions = { ...options.success };
		if (options.success?.isPagination) {
			if (Array.isArray(options.success.type)) {
				throw new Error('type require string or function');
			}
			apiResOpts['schema'] = {
				allOf: [
					{ $ref: getSchemaPath(PaginationResponseDto) },
					{
						properties: {
							data: {
								type: 'array',
								items: { $ref: getSchemaPath(options.success.type as string | Function) },
							},
						},
					},
				],
			};
			optionDecorators.push(ApiExtraModels(PaginationResponseDto), UseInterceptors(PaginationReponseInterceptor));
		} else {
			apiResOpts['type'] = options.success.type;
		}
		optionDecorators.push(ApiResponse(apiResOpts));
	}

	if (options?.exceptions) {
		const apiResData: { [x: number]: string } = {};
		for (const iterator of options.exceptions) {
			const { context, type, message, status } = iterator;
			if (!apiResData[status]) {
				apiResData[status] = '';
			}
			apiResData[status] += JSON.stringify({ context, type, message }, null, '\t') + '\n\n';
		}
		for (const status of Object.keys(apiResData)) {
			optionDecorators.push(ApiResponse({ status: +status, description: apiResData[status] }));
		}
	}

	return optionDecorators;
}

export function HttpResponse(options?: IHttpResponse) {
	const optionDecorators = initializeDecorators(options);
	return applyDecorators(...optionDecorators);
}

export function HttpResponseSuccess(options: IHttpResponseSuccess) {
	const optionDecorators = initializeDecorators({ success: options });
	return applyDecorators(...optionDecorators);
}

export function HttpResponseError(exceptions?: IResponseExceptionDoc[]) {
	const optionDecorators = initializeDecorators({ exceptions });
	return applyDecorators(...optionDecorators);
}
