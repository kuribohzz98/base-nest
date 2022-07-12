import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { DtoInt, DtoNumber } from './number.decorator';

class DtoNumberTest {
	@DtoNumber()
	n: any;

	@DtoInt()
	i: any;
}

class DtoArrayNumberTest {
	@DtoNumber({ each: true })
	n: any[];

	@DtoInt({ each: true })
	i: any[];
}

class DtoArrayNumberTestTransform {
	@DtoNumber({ transformToNumber: true })
	n: string;

	@DtoInt({ transformToNumber: true })
	i: string;

	@DtoNumber({ transformToNumber: true, each: true })
	na: string[];

	@DtoInt({ transformToNumber: true, each: true })
	ia: string[];

	@DtoNumber({ transformToNumber: true, each: true })
	special: string;
}

describe('number.decorator', () => {
	let instance: DtoNumberTest;
	beforeEach(() => {
		instance = new DtoNumberTest();
	});

	describe('run test', () => {
		it('shoud pass with value is a number', async () => {
			instance.n = 1;
			instance.i = 1;
			const object = plainToInstance(DtoNumberTest, instance);
			const errors = await validate(object);
			expect(errors).toEqual([]);
		});

		it('shoud fail with int value is not a number integer', async () => {
			instance.i = 1.5;
			const object = plainToInstance(DtoNumberTest, instance);
			const errors = await validate(object);
			expect(errors).not.toEqual([]);
		});

		it('shoud fail with value is not a number', async () => {
			instance.n = '1';
			const object = plainToInstance(DtoNumberTest, instance);
			const errors = await validate(object);
			expect(errors).not.toEqual([]);
		});
	});
});

describe('number-array.decorator', () => {
	let instance: DtoArrayNumberTest;
	beforeEach(() => {
		instance = new DtoArrayNumberTest();
	});

	describe('run test', () => {
		it('shoud pass with value is an array number', async () => {
			instance.n = [1];
			instance.i = [1];
			const object = plainToInstance(DtoArrayNumberTest, instance);
			const errors = await validate(object);
			expect(errors).toEqual([]);
		});

		it('shoud fail with int value is not an array number integer', async () => {
			instance.i = [1.5, 1];
			const object = plainToInstance(DtoArrayNumberTest, instance);
			const errors = await validate(object);
			expect(errors).not.toEqual([]);
		});

		it('shoud fail with value is not an array number', async () => {
			instance.n = ['1', 1];
			const object = plainToInstance(DtoArrayNumberTest, instance);
			const errors = await validate(object);
			expect(errors).not.toEqual([]);
		});
	});
});

describe('number-transform.decorator', () => {
	let instance: DtoArrayNumberTestTransform;
	beforeEach(() => {
		instance = new DtoArrayNumberTestTransform();
	});

	describe('run test', () => {
		it('shoud pass with value to be converted to number or array number', async () => {
			instance.n = '1';
			instance.i = '1';
			instance.na = ['1', '2'];
			instance.ia = ['1', '2'];
			instance.special = '1';
			const object = plainToInstance(DtoArrayNumberTestTransform, instance);
			const errors = await validate(object);
			expect(errors).toEqual([]);
		});
	});
});
