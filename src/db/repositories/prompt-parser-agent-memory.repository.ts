import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { PromptParserAgentMemoryEntity } from "@db/entities";
import { DataSource } from "typeorm";

@Injectable()
export class PromptParserAgentMemoryRepository extends BaseRepository<PromptParserAgentMemoryEntity> {
	constructor(datasource: DataSource) {
		super(PromptParserAgentMemoryEntity, datasource.createEntityManager());
	}
}
