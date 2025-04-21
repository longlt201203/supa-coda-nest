import { Injectable, NotFoundException } from "@nestjs/common";
import {
	CreateSessionRequest,
	UpdateSessionRequest,
	SessionQuery,
} from "./dto";
import {
	BaAgentMemoryRepository,
	DevAgentMemoryRepository,
	GreetingAgentMemoryRepository,
	PromptParserAgentMemoryRepository,
	SessionRepository,
} from "@db/repositories";

@Injectable()
export class SessionService {
	constructor(
		private readonly sessionRepository: SessionRepository,
		private readonly greetingAgentMemoryRepository: GreetingAgentMemoryRepository,
		private readonly baAgentMemoryRepository: BaAgentMemoryRepository,
		private readonly promptParserAgentMemoryRepository: PromptParserAgentMemoryRepository,
		private readonly devAgentMemoryRepository: DevAgentMemoryRepository,
	) {}

	async createOne(dto: CreateSessionRequest) {
		return await this.sessionRepository.save({
			conversation: JSON.stringify([]),
		});
	}

	async updateOne(id: string, dto: UpdateSessionRequest) {}

	async findMany(query: SessionQuery) {
		return await this.sessionRepository.find({
			order: {
				createdAt: "DESC",
			},
			select: ["id", "createdAt"],
		});
	}

	async findOne(id: string, fail: boolean = false) {
		const session = await this.sessionRepository.findOne({
			where: {
				id: id,
			},
		});
		if (!session && fail) {
			throw new NotFoundException("Session not found");
		}
		return session;
	}

	async deleteOne(id: string) {
		await Promise.all([
			this.sessionRepository.delete(id),
			this.greetingAgentMemoryRepository.delete({ sessionId: id }),
			this.promptParserAgentMemoryRepository.delete({ sessionId: id }),
			this.baAgentMemoryRepository.delete({ sessionId: id }),
			this.devAgentMemoryRepository.delete({ sessionId: id }),
		]);
	}

	async appendConversation(sessionId: string, conversation: any[]) {
		const session = await this.findOne(sessionId);
		const sessionConversation = JSON.parse(session.conversation) as any[];
		session.conversation = JSON.stringify([
			...sessionConversation,
			...conversation,
		]);
		await this.sessionRepository.save(session);
	}
}
