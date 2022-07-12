import { MaxLimitPagination } from '@constants/api.constant';

import { DtoId, DtoInt } from '@shared/decorators/dto/number.decorator';

export class BaseParamDto {
	@DtoId({ transformToNumber: true })
	id: number;
}

export class BasePaginationRequestDto {
	@DtoInt({ min: 1, max: MaxLimitPagination, transformToNumber: true })
	limit: number;

	@DtoInt({ min: 1, transformToNumber: true })
	page: number;
}
