import { SessionEntity } from "@db/entities";
import { ApiProperty } from "@nestjs/swagger";

export class ConversationItem {
	@ApiProperty()
	type: string;

	@ApiProperty()
	content: string;
}

export class SessionResponse {
	@ApiProperty()
	id: string;

	@ApiProperty({ type: ConversationItem, isArray: true, required: false })
	conversation?: ConversationItem[];

	@ApiProperty()
	createdAt: Date;

	static fromEntity(entity: SessionEntity): SessionResponse {
		return {
			id: entity.id,
			conversation: entity.conversation && JSON.parse(entity.conversation),
			createdAt: entity.createdAt,
		};
	}

	static fromEntities(entities: SessionEntity[]) {
		return entities.map(this.fromEntity);
	}
}
