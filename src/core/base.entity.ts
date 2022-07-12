import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn()
	id: number;
}

export abstract class BaseEntityIncludeTimeUpdate extends BaseEntity {
	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;
}

export abstract class BaseEntityIncludeTimeDelete extends BaseEntity {
	@DeleteDateColumn({ name: 'deleted_at', nullable: true })
	deletedAt: Date;
}

export abstract class BaseEntityIncludeTime extends BaseEntityIncludeTimeUpdate {
	@DeleteDateColumn({ name: 'deleted_at', nullable: true })
	deletedAt: Date;
}
