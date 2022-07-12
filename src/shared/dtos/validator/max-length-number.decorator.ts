import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

function toFixed(x): number {
	if (Math.abs(x) < 1.0) {
		const e = parseInt(x.toString().split('e-')[1]);
		if (e) {
			x *= Math.pow(10, e - 1);
			x = '0.' + new Array(e).join('0') + x.toString().substring(2);
		}
	} else {
		let e = parseInt(x.toString().split('+')[1]);
		if (e > 20) {
			e -= 20;
			x /= Math.pow(10, e);
			x += new Array(e + 1).join('0');
		}
	}
	return x;
}

@ValidatorConstraint({ name: 'lengthNumber', async: false })
class MaxLengthNumberConstraint implements ValidatorConstraintInterface {
	validate(value: number, args: ValidationArguments) {
		let numberString: string = toFixed(value).toString();
		if (args.constraints[1] as boolean) {
			numberString = numberString.split('.')[0];
		}
		return numberString.length <= args.constraints[0];
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} is too long`;
	}
}

export function MaxLengthNumber(maxLength: number, isDecimalNumber?: boolean, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [maxLength, isDecimalNumber],
			validator: MaxLengthNumberConstraint,
		});
	};
}
