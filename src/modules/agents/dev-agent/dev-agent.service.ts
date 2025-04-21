import { Injectable, OnModuleInit } from "@nestjs/common";
import { genAI, SupaCodaClsStore } from "@utils";
import * as fs from "fs";
import { AnalyzeStruturedUserRequirementResponse } from "../ba-agent/dto";
import { DevAgentMemoryRepository } from "@db/repositories";
import { ContentListUnion } from "@google/genai";
import { ClsService } from "nestjs-cls";

@Injectable()
export class DevAgentService implements OnModuleInit {
	constructor(
		private readonly devAgentMemoryRepository: DevAgentMemoryRepository,
		private readonly cls: ClsService<SupaCodaClsStore>,
	) {}

	private instructionFilePath = "instructions/dev-agent.txt";
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
		request: AnalyzeStruturedUserRequirementResponse,
		response: string,
	) {
		const sessionId = this.cls.get("session.id");
		await this.devAgentMemoryRepository.save({
			input: JSON.stringify(request),
			output: response,
			sessionId: sessionId,
		});
	}

	private async getMemories() {
		const sessionId = this.cls.get("session.id");
		const entities = await this.devAgentMemoryRepository.find({
			where: {
				sessionId: sessionId,
			},
		});
		return entities.map((item) => ({
			input: item.input,
			output: item.output,
		}));
	}

	async generateCode(input: AnalyzeStruturedUserRequirementResponse) {
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
			},
		});
		const data = response.text;
		await this.addMemory(input, data);
		return data;
	}
}
