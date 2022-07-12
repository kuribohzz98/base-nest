import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsers1641780772744 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.createTable(
			new Table({
				name: 'users',
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
						name: 'uid',
						type: 'varchar',
						length: '20',
					},
					{
						name: 'type',
						type: 'tinyint',
						width: 1,
						default: 1,
					},
					{
						name: 'is_verified',
						type: 'boolean',
						default: 0,
					},
					{
						name: 'is_blocked',
						type: 'boolean',
						default: 0,
					},
					{
						name: 'email',
						type: 'varchar',
						length: '255',
						isNullable: true,
					},
					{
						name: 'password',
						type: 'varchar',
						length: '255',
						isNullable: true,
					},
					{
						name: 'facebook_key',
						type: 'varchar',
						length: '100',
						isNullable: true,
					},
					{
						name: 'google_key',
						type: 'varchar',
						length: '100',
						isNullable: true,
					},
					{
						name: 'twitter_key',
						type: 'varchar',
						length: '100',
						isNullable: true,
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
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		return queryRunner.dropTable('users', true, true);
	}
}
