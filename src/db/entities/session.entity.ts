import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class SessionEntity {
	@PrimaryGeneratedColumn("uuid")
	id: string;

	@Column({ type: "text" })
	conversation: string;

	@CreateDateColumn()
	createdAt: Date;
}
