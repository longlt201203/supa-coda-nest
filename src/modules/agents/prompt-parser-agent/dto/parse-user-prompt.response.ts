import { Schema, Type } from "@google/genai";

export interface ParseUserPromptResponse {
	task: string;
	language: string;
	input: string;
	output: string;
	constraints: string[];
	clarification_needed: boolean;
}

export const ParseUserPromptResponseJsonSchema: Schema = {
	type: Type.OBJECT,
	properties: {
		task: {
			type: Type.STRING,
			description: "A short summary of what the user wants to build or solve",
		},
		language: {
			type: Type.STRING,
			description: "Preferred programming language if known (or 'unspecified')",
		},
		input: {
			type: Type.STRING,
			description: "Describe what inputs the code will take",
		},
		output: {
			type: Type.STRING,
			description: "Describe the expected output or result",
		},
		constraints: {
			type: Type.ARRAY,
			description: "Any limits, rules, or preferences if mentioned",
			items: {
				type: Type.STRING,
			},
		},
		clarification_needed: {
			type: Type.BOOLEAN,
			description:
				"True if clarification is needed from the user, false otherwise",
		},
	},
	required: [
		"task",
		"language",
		"input",
		"output",
		"constraints",
		"clarification_needed",
	],
};
