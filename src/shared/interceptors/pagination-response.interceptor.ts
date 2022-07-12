import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { map, Observable } from 'rxjs';

import { BasePaginationRequestDto } from '@shared/dtos/base-request.dto';
import { PaginationResponseDto } from '@shared/dtos/base-response.dto';
import { SystemException } from '@shared/exceptions/http-exceptions/system.exception';
import { httpException } from '@shared/exceptions/http.exception';

function isInvalidReponse(d: [any[], number]) {
	return !Array.isArray(d) || d.length !== 2 || !Array.isArray(d[0]) || typeof d[1] !== 'number';
}

/**
 * controller reponse require type `[array[], number]`
 */
export class PaginationReponseInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest() as Request;
		const query = request.query as unknown as BasePaginationRequestDto;

		// next to pipe throw error validate
		if (!query?.limit || !query?.page) return next.handle();

		return next.handle().pipe(
			map((d: [any[], number]) => {
				if (isInvalidReponse(d)) {
					httpException(SystemException.General, 'INTERNAL_SERVER_ERROR', 'pagination-reponse-invalid');
				}
				return new PaginationResponseDto({
					data: d[0],
					total: d[1],
					currentPage: +query.page,
				});
			}),
		);
	}
}
