import { Module } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { AgentsController } from "./agents.controller";
import { PromptParserAgentModule } from "./prompt-parser-agent";
import { BaAgentModule } from "./ba-agent";
import { DevAgentModule } from "./dev-agent";
import { GreetingAgentModule } from "./greeting-agent";
import { SessionModule } from "@modules/session";

@Module({
	imports: [
		SessionModule,
		GreetingAgentModule,
		PromptParserAgentModule,
		BaAgentModule,
		DevAgentModule,
	],
	providers: [AgentsService],
	exports: [AgentsService],
	controllers: [AgentsController],
})
export class AgentsModule {}
