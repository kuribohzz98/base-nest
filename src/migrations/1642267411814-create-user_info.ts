import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUserInfo1642267411814 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(
			new Table({
				name: 'user_info',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
						width: 11,
					},
					{
						name: 'user_id',
						type: 'int',
						width: 1,
					},
					{
						name: 'first_name',
						type: 'varchar',
						length: '100',
					},
					{
						name: 'last_name',
						type: 'varchar',
						length: '100',
					},
					{
						name: 'gender',
						type: 'tinyint',
						width: 1,
						isNullable: true,
					},
					{
						name: 'phone_number',
						type: 'varchar',
						length: '15',
						isNullable: true,
					},
					{
						name: 'address',
						type: 'json',
						isNullable: true,
					},
					{
						name: 'created_at',
						type: 'datetime',
						default: 'CURRENT_TIMESTAMP',
					},
					{
						name: 'updated_at',
						type: 'datetime',
						default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropTable('user_info', true, true);
	}
}
