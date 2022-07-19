import type { EntityTarget, ObjectLiteral } from 'typeorm';

export function EntityRepo(target: EntityTarget<ObjectLiteral>) {
	return function (constructor: Function) {
		Reflect.defineMetadata('custom-repo:entity', target, constructor);
	};
}
