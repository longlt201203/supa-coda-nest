import {
	BadRequestException,
	CanActivate,
	ExecutionContext,
	Injectable,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { SessionService } from "./session.service";
import { Request } from "express";
import { ClsService } from "nestjs-cls";
import { SupaCodaClsStore } from "@utils";

@Injectable()
export class SessionGuard implements CanActivate {
	constructor(
		private readonly sessionService: SessionService,
		private readonly cls: ClsService<SupaCodaClsStore>,
	) {}

	async canActivate(context: ExecutionContext) {
		const request = context.switchToHttp().getRequest<Request>();
		const sessionId = this.getSessionIdFromHeader(request);
		if (!sessionId)
			throw new BadRequestException("Session ID must be provided!");
		const session = await this.sessionService.findOne(sessionId);
		if (!session) throw new BadRequestException("Invalid session ID!");
		this.cls.set("session.id", sessionId);
		return true;
	}

	private getSessionIdFromHeader(req: Request) {
		const sessionId = req.headers["x-session-id"];
		return typeof sessionId === "string" ? sessionId : null;
	}
}
