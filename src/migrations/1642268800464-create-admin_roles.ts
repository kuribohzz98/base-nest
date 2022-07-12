import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createAdminRoles1642268800464 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(
			new Table({
				name: 'admin_roles',
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
						name: 'name',
						type: 'varchar',
						length: '255',
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
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropTable('admin_roles', true, true);
	}
}
