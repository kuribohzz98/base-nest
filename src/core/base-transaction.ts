import { firstValueFrom, isObservable } from 'rxjs';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

type KeyResultType = { [x: string]: string };
type ResultType = { [x: string]: any };

const symbolKeyResult = Symbol('key-result');
const symbolFunction = Symbol('function');

abstract class OrmTransaction {
	protected manager: EntityManager;
	protected _result: ResultType = {};
	private keyResult: KeyResultType = {};
	private functions: string[] = [];

	constructor() {
		this.keyResult = Reflect.getMetadata(symbolKeyResult, this);
		this.functions = Reflect.getMetadata(symbolFunction, this);
	}

	get result() {
		return this.result;
	}

	async exec() {
		if (!this._checkFuncs()) return;
		await this.createTransaction.bind(this);
	}

	private _checkFuncs() {
		return this.functions?.length;
	}

	@Transaction()
	private async createTransaction(@TransactionManager() manager: EntityManager) {
		await this.run(manager);
	}

	private async run(manager: EntityManager) {
		this.manager = manager;
		for (const iterator of this.functions) {
			const funcExec = (this[iterator] as Function).call(this);
			const result = isObservable(funcExec) ? await firstValueFrom(funcExec) : await funcExec;
			if (this.keyResult?.[iterator]) {
				this._result[this.keyResult[iterator]] = result;
			}
		}
	}
}

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

export function TransactionAction(keyName?: string) {
	return function (target: OrmTransaction, propertyKey: string) {
		defineFunctions(target, propertyKey);
		defineResultKey(target, propertyKey, keyName);
	};
}
