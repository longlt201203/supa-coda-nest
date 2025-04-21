import { Injectable, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import { MessageRequest } from "../dto";
import { genAI, SupaCodaClsStore } from "@utils";
import { DoGreetingResponse, DoGreetingResponseJsonSchema } from "./dto";
import { GreetingAgentMemoryRepository } from "@db/repositories";
import { ContentListUnion } from "@google/genai";
import { ClsService } from "nestjs-cls";

@Injectable()
export class GreetingAgentService implements OnModuleInit {
	constructor(
		private readonly greetingAgentMemoryRepository: GreetingAgentMemoryRepository,
		private readonly cls: ClsService<SupaCodaClsStore>,
	) {}

	private instructionFilePath = "instructions/greeting-agent.txt";
	private systemInstruction = "";

	onModuleInit() {
		this.loadSystemInstruction();
	}

	private loadSystemInstruction() {
		this.systemInstruction = fs
			.readFileSync(this.instructionFilePath)
			.toString("utf-8");
	}

	private async getMemories() {
		const sessionId = this.cls.get("session.id");
		const entities = await this.greetingAgentMemoryRepository.find({
			where: {
				sessionId: sessionId,
			},
		});
		return entities.map((item) => ({
			input: item.input,
			output: item.output,
		}));
	}

	private async addMemory(
		request: MessageRequest,
		response: DoGreetingResponse,
	) {
		const sessionId = this.cls.get("session.id");
		await this.greetingAgentMemoryRepository.save({
			input: request.message,
			output: response.message,
			sessionId: sessionId,
		});
	}

	async doGreeting(dto: MessageRequest) {
		const model = "gemini-2.0-flash";
		const memories = await this.getMemories();
		const contents: ContentListUnion = [];
		memories.forEach((item) => {
			contents.push({
				role: "user",
				parts: [{ text: item.input }],
			});
			contents.push({
				role: "model",
				parts: [{ text: item.output }],
			});
		});
		contents.push({
			role: "user",
			parts: [{ text: dto.message }],
		});
		const response = await genAI.models.generateContent({
			model: model,
			contents: contents,
			config: {
				systemInstruction: this.systemInstruction,
				responseMimeType: "application/json",
				responseSchema: DoGreetingResponseJsonSchema,
			},
		});
		const data = JSON.parse(response.text) as DoGreetingResponse;
		if (data.handled) await this.addMemory(dto, data);
		return data;
	}
}
