import { Injectable, OnModuleInit } from "@nestjs/common";
import { genAI, SupaCodaClsStore } from "@utils";
import * as fs from "fs";
import {
	ParseUserPromptResponse,
	ParseUserPromptResponseJsonSchema,
} from "./dto";
import { MessageRequest } from "../dto";
import { PromptParserAgentMemoryRepository } from "@db/repositories";
import { ContentListUnion } from "@google/genai";
import { ClsService } from "nestjs-cls";

@Injectable()
export class PromptParserAgentService implements OnModuleInit {
	constructor(
		private readonly promptParserAgentMemoryRepository: PromptParserAgentMemoryRepository,
		private readonly cls: ClsService<SupaCodaClsStore>,
	) {}

	private instructionFilePath = "instructions/prompt-parser-agent.txt";
	private systemInstruction = "";

	onModuleInit() {
		this.loadSystemInstruction();
	}

	private loadSystemInstruction() {
		this.systemInstruction = fs
			.readFileSync(this.instructionFilePath)
			.toString("utf-8");
	}

	private async addMemory(
		request: MessageRequest,
		response: ParseUserPromptResponse,
	) {
		const sessionId = this.cls.get("session.id");
		await this.promptParserAgentMemoryRepository.save({
			input: request.message,
			output: JSON.stringify(response),
			sessionId: sessionId,
		});
	}

	private async getMemories() {
		const sessionId = this.cls.get("session.id");
		const entities = await this.promptParserAgentMemoryRepository.find({
			where: {
				sessionId: sessionId,
			},
		});
		return entities.map((item) => {
			return {
				input: item.input,
				output: item.output,
			};
		});
	}

	async parseUserPrompt(dto: MessageRequest) {
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
				responseSchema: ParseUserPromptResponseJsonSchema,
			},
		});
		const data = JSON.parse(response.text) as ParseUserPromptResponse;
		await this.addMemory(dto, data);
		return data;
	}
}
