import { Module } from "@nestjs/common";
import { PromptParserAgentService } from "./prompt-parser-agent.service";

@Module({
	providers: [PromptParserAgentService],
	exports: [PromptParserAgentService],
})
export class PromptParserAgentModule {}
