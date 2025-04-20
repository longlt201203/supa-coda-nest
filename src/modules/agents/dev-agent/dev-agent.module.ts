import { Module } from "@nestjs/common";
import { DevAgentService } from "./dev-agent.service";

@Module({
	providers: [DevAgentService],
	exports: [DevAgentService],
})
export class DevAgentModule {}
