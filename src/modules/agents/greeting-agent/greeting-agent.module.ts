import { Module } from "@nestjs/common";
import { GreetingAgentService } from "./greeting-agent.service";

@Module({
	providers: [GreetingAgentService],
	exports: [GreetingAgentService],
})
export class GreetingAgentModule {}
