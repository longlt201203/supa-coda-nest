import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { GreetingAgentMemoryEntity } from "@db/entities";
import { DataSource } from "typeorm";

@Injectable()
export class GreetingAgentMemoryRepository extends BaseRepository<GreetingAgentMemoryEntity> {
	constructor(datasource: DataSource) {
		super(GreetingAgentMemoryEntity, datasource.createEntityManager());
	}
}
