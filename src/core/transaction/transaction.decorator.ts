import type { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

import { OrmTransaction } from './base.transaction';
import { symbolFunction, symbolKeyResult } from './transaction.constant';

function defineFunctions(target: OrmTransaction, propertyKey: string) {
	let functions = Reflect.getMetadata(symbolFunction, target);
	if (!functions) {
		functions = [];
		Reflect.defineMetadata(symbolFunction, functions, target);
	}
	functions.push(propertyKey);
}

function defineResultKey(target: OrmTransaction, propertyKey: string, keyName: string) {
	if (!keyName) return;
	let keyResult = Reflect.getMetadata(symbolKeyResult, target);
	if (!keyResult) {
		keyResult = {};
		Reflect.defineMetadata(symbolKeyResult, keyResult, target);
	}
	keyResult[propertyKey] = keyName;
}

export function OrmIsolation(isolationLevel?: IsolationLevel) {
	return function <T extends { new (...args: any[]): {} }>(base: T) {
		return class extends base {
			isolationLevel = isolationLevel;
		};
	};
}

export function TransactionAction(keyName?: string) {
	return function (target: OrmTransaction, propertyKey: string) {
		defineFunctions(target, propertyKey);
		defineResultKey(target, propertyKey, keyName);
	};
}
