import { Module } from "@nestjs/common";
import { SessionService } from "./session.service";
import { SessionController } from "./session.controller";

@Module({
	providers: [SessionService],
	exports: [SessionService],
	controllers: [SessionController],
})
export class SessionModule {}
