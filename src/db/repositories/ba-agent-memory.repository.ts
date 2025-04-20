import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { BaAgentMemoryEntity } from "@db/entities";
import { DataSource } from "typeorm";

@Injectable()
export class BaAgentMemoryRepository extends BaseRepository<BaAgentMemoryEntity> {
	constructor(datasource: DataSource) {
		super(BaAgentMemoryEntity, datasource.createEntityManager());
	}
}
