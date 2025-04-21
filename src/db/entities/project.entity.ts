import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column({ type: "text" })
	projectStructure: string;
}
