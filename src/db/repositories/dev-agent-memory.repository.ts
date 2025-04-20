import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { DevAgentMemoryEntity } from "@db/entities";
import { DataSource } from "typeorm";

@Injectable()
export class DevAgentMemoryRepository extends BaseRepository<DevAgentMemoryEntity> {
	constructor(datasource: DataSource) {
		super(DevAgentMemoryEntity, datasource.createEntityManager());
	}
}
