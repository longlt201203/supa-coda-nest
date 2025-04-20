import { Injectable } from "@nestjs/common";
import { PromptParserAgentService } from "./prompt-parser-agent";
import { BaAgentService } from "./ba-agent";
import { DevAgentService } from "./dev-agent";
import { Observable } from "rxjs";
import { MessageRequest } from "./dto";
import { GreetingAgentService } from "./greeting-agent";

@Injectable()
export class AgentsService {
	constructor(
		private readonly greetingAgentService: GreetingAgentService,
		private readonly promptParserAgentService: PromptParserAgentService,
		private readonly baAgentService: BaAgentService,
		private readonly devAgentService: DevAgentService,
	) {}

	handleUserMessage(dto: MessageRequest): Observable<MessageEvent> {
		return new Observable<MessageEvent>((sub) => {
			sub.next(
				new MessageEvent("debug_message", {
					data: `Receive user message: ${dto.message}`,
				}),
			);

			sub.next(
				new MessageEvent("debug_message", { data: "Start to do greeting" }),
			);
			this.greetingAgentService
				.doGreeting(dto)
				.then((greetingResult) => {
					sub.next(
						new MessageEvent("message", { data: greetingResult.message }),
					);

					if (greetingResult.handled) {
						sub.complete();
					} else {
						sub.next(
							new MessageEvent("debug_message", {
								data: "Start to parse the user message",
							}),
						);
						this.promptParserAgentService
							.parseUserPrompt(dto)
							.then((parseUserPromptResult) => {
								sub.next(
									new MessageEvent("debug_message", {
										data: `Parse user message successfully`,
									}),
								);
								sub.next(
									new MessageEvent("debug_message", {
										data: JSON.stringify(parseUserPromptResult),
									}),
								);

								sub.next(
									new MessageEvent("debug_message", {
										data: "Start to analyze the structured user requirement",
									}),
								);
								this.baAgentService
									.analyzeStructuredUserRequirement(parseUserPromptResult)
									.then((analyzeStructuredUserRequirementResult) => {
										sub.next(
											new MessageEvent("debug_message", {
												data: `Analyze structured user requirement successfully`,
											}),
										);
										sub.next(
											new MessageEvent("debug_message", {
												data: JSON.stringify(
													analyzeStructuredUserRequirementResult,
												),
											}),
										);

										sub.next(
											new MessageEvent("debug_message", {
												data: "Start to generate the code",
											}),
										);
										this.devAgentService
											.generateCode(analyzeStructuredUserRequirementResult)
											.then((code) => {
												sub.next(
													new MessageEvent("debug_message", {
														data: `Code generated:`,
													}),
												);
												sub.next(
													new MessageEvent("code_message", {
														data: JSON.stringify(code),
													}),
												);
												sub.complete();
											})
											.catch((err) => {
												console.log(err);
												sub.next(new MessageEvent("error", { data: err }));
												sub.complete();
											});
									})
									.catch((err) => {
										console.log(err);
										sub.next(new MessageEvent("error", { data: err }));
										sub.complete();
									});
							})
							.catch((err) => {
								console.log(err);
								sub.next(new MessageEvent("error", { data: err }));
								sub.complete();
							});
					}
				})
				.catch((err) => {
					console.log(err);
					sub.next(new MessageEvent("error", { data: err }));
					sub.complete();
				});
		});
	}
}
