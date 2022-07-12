import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { DtoEnum } from './enum.decorator';

enum ETest {
	A = 1,
	B = 2,
}

class DtoEnumTest {
	@DtoEnum(ETest)
	e: ETest;
}

class DtoEnumArrayTest {
	@DtoEnum(ETest, { each: true })
	e: ETest[];
}

describe('enum.decorator', () => {
	let instance: DtoEnumTest;
	beforeEach(() => {
		instance = new DtoEnumTest();
	});

	describe('run test', () => {
		it('shoud pass with value in enum', async () => {
			instance.e = 1;
			const object = plainToInstance(DtoEnumTest, instance);
			const errors = await validate(object);
			expect(errors).toEqual([]);
		});

		it('shoud fail with value is not in enum', async () => {
			instance.e = 4;
			const object = plainToInstance(DtoEnumTest, instance);
			const errors = await validate(object);
			expect(errors).not.toEqual([]);
		});
	});
});

describe('enum-array.decorator', () => {
	let instance: DtoEnumArrayTest;
	beforeEach(() => {
		instance = new DtoEnumArrayTest();
	});

	describe('run test', () => {
		it('shoud pass with value in array enum', async () => {
			instance.e = [1, 2];
			const object = plainToInstance(DtoEnumArrayTest, instance);
			const errors = await validate(object);
			expect(errors).toEqual([]);
		});

		it('shoud fail with value is not in array enum', async () => {
			instance.e = [1, 2, 3];
			const object = plainToInstance(DtoEnumArrayTest, instance);
			const errors = await validate(object);
			expect(errors).not.toEqual([]);
		});
	});
});
