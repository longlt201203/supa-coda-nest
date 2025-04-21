import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { Response } from "express";
import { MessageRequest } from "./dto";
import { SessionGuard, SessionService } from "@modules/session";
import { ApiHeader } from "@nestjs/swagger";
import { tap } from "rxjs";
import { ClsService } from "nestjs-cls";
import { SupaCodaClsStore } from "@utils";

@Controller("agents")
@ApiHeader({ name: "x-session-id" })
@UseGuards(SessionGuard)
export class AgentsController {
	constructor(
		private readonly agentsService: AgentsService,
		private readonly cls: ClsService<SupaCodaClsStore>,
		private readonly sessionService: SessionService,
	) {}

	@Post("message")
	handleUserMessage(@Body() dto: MessageRequest, @Res() res: Response) {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");

		const sessionId = this.cls.get("session.id");
		const conversation: any[] = [
			{
				type: "user_message",
				data: dto.message,
			},
		];

		this.agentsService
			.handleUserMessage(dto)
			.pipe(
				tap((v) => {
					conversation.push({
						type: v.type,
						data: JSON.stringify(v.data),
					});
				}),
			)
			.subscribe({
				next: (v) => {
					if (v.type) res.write(`event: ${v.type}\n`);
					res.write(
						`data: ${typeof v.data === "string" ? v.data : JSON.stringify(v.data)}\n\n`,
					);
				},
				complete: () => {
					this.sessionService.appendConversation(sessionId, conversation);
					res.end();
				},
				error: (err) => {
					res.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);
					res.end();
				},
			});
	}
}
