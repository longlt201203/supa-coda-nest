import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class GreetingAgentMemoryEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "text" })
	input: string;

	@Column({ type: "text" })
	output: string;

	@Column()
	sessionId: string;

	@CreateDateColumn()
	createdAt: Date;
}
