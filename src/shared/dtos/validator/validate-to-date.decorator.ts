import {
	registerDecorator,
	ValidationArguments,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateToDate', async: false })
class ValidateToDateConstraint implements ValidatorConstraintInterface {
	validate(value: string, args: ValidationArguments) {
		try {
			const fromDate = new Date((args.object as any)[args.constraints[0]]).getTime();
			const addition = args.constraints[1];
			const toDate = new Date(value).getTime();
			return fromDate + (addition || 0) <= toDate;
		} catch (error) {
			return false;
		}
	}

	defaultMessage(args: ValidationArguments) {
		return `${args.property} require greater than equals ${args.constraints[0]}${
			args.constraints[1] ? ' +' + args.constraints[1] + ' miliseconds' : ''
		}`;
	}
}

export function ValidateToDate(fromDatePropertyName: string, addition?: number, validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: validationOptions,
			constraints: [fromDatePropertyName, addition],
			validator: ValidateToDateConstraint,
		});
	};
}
