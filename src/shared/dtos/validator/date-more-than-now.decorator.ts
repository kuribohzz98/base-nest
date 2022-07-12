import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'dateMoreThanNow', async: false })
class DateMoreThanNowConstraint implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		try {
			const options = args.constraints[0] as { addition?: number; substract?: number };
			const date = new Date(value).getTime();
			return date >= new Date().getTime() + (options?.addition || 0) - (options?.substract || 0);
		} catch (error) {
			return false;
		}
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} require greater than equals time now!`;
	}
}

/**
 *
 * @param options miliseconds
 */
export function DateMoreThanNow(
	options?: { addition?: number; substract?: number },
	validationOptions?: ValidationOptions,
) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [options],
			validator: DateMoreThanNowConstraint,
		});
	};
}
