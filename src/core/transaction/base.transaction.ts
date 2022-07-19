import { firstValueFrom, isObservable } from 'rxjs';
import { DataSource, EntityManager } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

type KeyResultType = { [x: string]: string };
type ResultType<T = any> = T & { [x: string]: any };

const symbolKeyResult = Symbol('tran-key-result');
const symbolFunction = Symbol('tran-function');

export abstract class OrmTransaction {
	protected manager: EntityManager;
	private _result: ResultType = {};
	private keyResult: KeyResultType = {};
	private functions: string[] = [];
	private isolationLevel: IsolationLevel;

	constructor() {
		this.keyResult = Reflect.getMetadata(symbolKeyResult, this);
		this.functions = Reflect.getMetadata(symbolFunction, this);
	}

	get result() {
		return this._result;
	}

	async exec(dataSource: DataSource) {
		if (!this._checkFuncs()) return;
		await this.execTransaction(dataSource);
		return this._result;
	}

	private _checkFuncs() {
		return this.functions?.length;
	}

	private async execTransaction(dataSource: DataSource) {
		const queryRunner = dataSource.createQueryRunner();

		await queryRunner.connect();
		await queryRunner.startTransaction(this.isolationLevel);

		try {
			await this.run(queryRunner.manager);

			await queryRunner.commitTransaction();
		} catch (err) {
			// since we have errors lets rollback the changes we made
			await queryRunner.rollbackTransaction();
		} finally {
			// you need to release a queryRunner which was manually instantiated
			await queryRunner.release();
		}
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
