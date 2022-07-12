import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createAdmins1642269357601 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(
			new Table({
				name: 'admins',
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
						name: 'email',
						type: 'varchar',
						length: '255',
					},
					{
						name: 'password',
						type: 'varchar',
						length: '255',
					},
					{
						name: 'type',
						type: 'tinyint',
						width: 1,
						isNullable: true,
					},
					{
						name: 'role_id',
						type: 'tinyint',
						width: 1,
						isNullable: true,
					},
					{
						name: 'name',
						type: 'varchar',
						length: '100',
						isNullable: true,
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
						name: 'is_blocked',
						type: 'boolean',
						default: 0,
					},
					{
						name: 'last_update_privacy',
						type: 'timestamp',
						isNullable: true,
					},
					{
						name: 'verify_content',
						type: 'json',
						isNullable: true,
					},
					{
						name: 'deleted_at',
						type: 'datetime',
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
				foreignKeys: [
					{
						name: 'admins-admin_roles',
						referencedColumnNames: ['id'],
						referencedTableName: 'admin_roles',
						columnNames: ['role_id'],
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropTable('admins', true, true);
	}
}
