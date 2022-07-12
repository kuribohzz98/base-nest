import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T = any> {
	data: T[];

	@ApiProperty()
	total: number;

	@ApiProperty()
	currentPage: number;

	constructor(data: Partial<PaginationResponseDto<T>>) {
		Object.assign(this, data);
	}
}
