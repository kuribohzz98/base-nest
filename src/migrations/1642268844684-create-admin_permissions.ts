import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createAdminPermissions1642268844684 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(
			new Table({
				name: 'admin_permissions',
				columns: [
					{
						name: 'id',
						isPrimary: true,
						generationStrategy: 'increment',
						isGenerated: true,
						type: 'int',
						width: 11,
					},
					{
						name: 'role_id',
						type: 'int',
						width: 11,
					},
					{
						name: 'function_id',
						type: 'int',
						width: 11,
					},
					{
						name: 'permission',
						type: 'tinyint',
						width: 1,
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
				foreignKeys: [
					{
						name: 'admin_permissions-admin_roles',
						referencedColumnNames: ['id'],
						referencedTableName: 'admin_roles',
						columnNames: ['role_id'],
					},
					{
						name: 'admin_permissions-admin_functions',
						referencedColumnNames: ['id'],
						referencedTableName: 'admin_functions',
						columnNames: ['function_id'],
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropTable('admin_permissions', true, true);
	}
}
