import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { ProjectEntity } from "@db/entities";
import { DataSource } from "typeorm";

@Injectable()
export class ProjectRepository extends BaseRepository<ProjectEntity> {
	constructor(datasource: DataSource) {
		super(ProjectEntity, datasource.createEntityManager());
	}
}
