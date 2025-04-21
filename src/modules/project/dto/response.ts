import { ApiProperty } from "@nestjs/swagger";
import { ProjectEntity } from "@db/entities";
import { ProjectTreeNode } from "./project-tree-node";

export class ProjectResponse {
	@ApiProperty()
	id: number;

	@ApiProperty()
	name: string;

	@ApiProperty({ type: ProjectTreeNode })
	projectStructure: ProjectTreeNode;

	static fromEntity(entity: ProjectEntity): ProjectResponse {
		return {
			id: entity.id,
			name: entity.name,
			projectStructure:
				entity.projectStructure &&
				(JSON.parse(entity.projectStructure) as ProjectTreeNode),
		};
	}

	static fromEntities(entities: ProjectEntity[]): ProjectResponse[] {
		return entities.map(this.fromEntity);
	}
}
