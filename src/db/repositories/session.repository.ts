import { Injectable } from "@nestjs/common";
import { BaseRepository } from "./base-repository";
import { SessionEntity } from "@db/entities";
import { DataSource } from "typeorm";

@Injectable()
export class SessionRepository extends BaseRepository<SessionEntity> {
	constructor(datasource: DataSource) {
		super(SessionEntity, datasource.createEntityManager());
	}
}
