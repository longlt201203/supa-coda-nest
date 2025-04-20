import { Schema, Type } from "@google/genai";

export interface DoGreetingResponse {
	handled: boolean;
	message: string;
}

export const DoGreetingResponseJsonSchema: Schema = {
	type: Type.OBJECT,
	properties: {
		handled: {
			type: Type.BOOLEAN,
			description: "true if the message is handled, false otherwise",
		},
		message: {
			type: Type.STRING,
			description: "the message to send to the user",
		},
	},
	required: ["handled", "message"],
} as const;
