import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { datasource } from "./datasource";
import { addTransactionalDataSource } from "typeorm-transactional";
import {
	BaAgentMemoryRepository,
	DevAgentMemoryRepository,
	GreetingAgentMemoryRepository,
	PromptParserAgentMemoryRepository,
	SessionRepository,
} from "./repositories";

const repositorires = [
	GreetingAgentMemoryRepository,
	PromptParserAgentMemoryRepository,
	BaAgentMemoryRepository,
	DevAgentMemoryRepository,
	SessionRepository,
];

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useFactory: () => datasource.options,
			dataSourceFactory: async () => addTransactionalDataSource(datasource),
		}),
	],
	providers: repositorires,
	exports: repositorires,
})
export class DbModule {}
