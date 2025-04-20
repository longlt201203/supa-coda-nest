import { ApiProperty } from "@nestjs/swagger";

export class MessageRequest {
	@ApiProperty({
		description: "The message to send to the agent",
		example: "Code me a sum function in Python",
	})
	message: string;
}
