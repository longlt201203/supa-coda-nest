import { Body, Controller, Post, Res, UseGuards } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { Response } from "express";
import { MessageRequest } from "./dto";
import { SessionGuard } from "@modules/session";
import { ApiHeader } from "@nestjs/swagger";

@Controller("agents")
@ApiHeader({ name: "x-session-id" })
@UseGuards(SessionGuard)
export class AgentsController {
	constructor(private readonly agentsService: AgentsService) {}

	@Post("message")
	handleUserMessage(@Body() dto: MessageRequest, @Res() res: Response) {
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");

		this.agentsService.handleUserMessage(dto).subscribe({
			next: (v) => {
				if (v.type) res.write(`event: ${v.type}\n`);
				res.write(
					`data: ${typeof v.data === "string" ? v.data : JSON.stringify(v.data)}\n\n`,
				);
			},
			complete: () => {
				res.end();
			},
			error: (err) => {
				res.write(`event: error\ndata: ${JSON.stringify(err)}\n\n`);
				res.end();
			},
		});
	}
}
