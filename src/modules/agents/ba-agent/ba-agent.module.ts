import { Module } from "@nestjs/common";
import { BaAgentService } from "./ba-agent.service";

@Module({
	providers: [BaAgentService],
	exports: [BaAgentService],
})
export class BaAgentModule {}
