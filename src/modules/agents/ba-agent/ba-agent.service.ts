import { Injectable, OnModuleInit } from "@nestjs/common";
import * as fs from "fs";
import { ParseUserPromptResponse } from "../prompt-parser-agent/dto";
import { genAI, SupaCodaClsStore } from "@utils";
import {
	AnalyzeStruturedUserRequirementResponse,
	AnalyzeStruturedUserRequirementResponseJsonSchema,
} from "./dto";
import { BaAgentMemoryRepository } from "@db/repositories";
import { ContentListUnion } from "@google/genai";
import { ClsService } from "nestjs-cls";

@Injectable()
export class BaAgentService implements OnModuleInit {
	constructor(
		private readonly baAgentMemoryRepository: BaAgentMemoryRepository,
		private readonly cls: ClsService<SupaCodaClsStore>,
	) {}

	private instructionFilePath = "instructions/ba-agent.txt";
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
		request: ParseUserPromptResponse,
		response: AnalyzeStruturedUserRequirementResponse,
	) {
		const sessionId = this.cls.get("session.id");
		await this.baAgentMemoryRepository.save({
			input: JSON.stringify(request),
			output: JSON.stringify(response),
			sessionId: sessionId,
		});
	}

	private async getMemories() {
		const sessionId = this.cls.get("session.id");
		const entities = await this.baAgentMemoryRepository.find({
			where: {
				sessionId: sessionId,
			},
		});
		return entities.map((item) => ({
			input: item.input,
			output: item.output,
		}));
	}

	async analyzeStructuredUserRequirement(input: ParseUserPromptResponse) {
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
			parts: [{ text: JSON.stringify(input) }],
		});
		const response = await genAI.models.generateContent({
			model: model,
			contents: contents,
			config: {
				systemInstruction: this.systemInstruction,
				responseMimeType: "application/json",
				responseSchema: AnalyzeStruturedUserRequirementResponseJsonSchema,
			},
		});
		const data = JSON.parse(
			response.text,
		) as AnalyzeStruturedUserRequirementResponse;
		await this.addMemory(input, data);
		return data;
	}
}
