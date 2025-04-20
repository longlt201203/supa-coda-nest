import { Injectable, NotFoundException } from "@nestjs/common";
import {
	CreateSessionRequest,
	UpdateSessionRequest,
	SessionQuery,
} from "./dto";
import { SessionRepository } from "@db/repositories";

@Injectable()
export class SessionService {
	constructor(private readonly sessionRepository: SessionRepository) {}

	async createOne(dto: CreateSessionRequest) {
		return await this.sessionRepository.save({});
	}

	async updateOne(id: string | number, dto: UpdateSessionRequest) {}

	async findMany(query: SessionQuery) {
		return await this.sessionRepository.find({
			order: {
				createdAt: "DESC",
			},
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

	async deleteOne(id: string | number) {
		await this.sessionRepository.delete(id);
	}
}
