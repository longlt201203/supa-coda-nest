import { Schema, Type } from "@google/genai";

// Define input and output spec interfaces to match schema
interface InputSpecItem {
	name: string;
	type: string;
}

interface OutputSpecItem {
	name: string;
	type: string;
}

interface TestCase {
	input: InputSpecItem;
	output: OutputSpecItem;
}

export interface AnalyzeStruturedUserRequirementResponse {
	feature: string;
	description: string;
	language: string;
	dependencies: string[];
	inputSpec: InputSpecItem;
	outputSpec: OutputSpecItem;
	constraints: string[];
	errorHandling: string;
	testCases: TestCase[];
	notes?: string;
}

const InputSpecItemSchema: Schema = {
	type: Type.OBJECT,
	description: "The input specification of the feature.",
	properties: {
		name: {
			type: Type.STRING,
			description: "The name of the input.",
		},
		type: {
			type: Type.STRING,
			description: "The type of the input.",
		},
	},
	required: ["name", "type"],
};

const OutputSpecItemSchema: Schema = {
	type: Type.OBJECT,
	description: "The output specification of the feature.",
	properties: {
		name: {
			type: Type.STRING,
			description: "The name of the output.",
		},
		type: {
			type: Type.STRING,
			description: "The type of the output.",
		},
	},
	required: ["name", "type"],
};

export const AnalyzeStruturedUserRequirementResponseJsonSchema: Schema = {
	type: Type.OBJECT,
	properties: {
		feature: {
			type: Type.STRING,
			description:
				"The feature of the application that the user wants to implement.",
		},
		description: {
			type: Type.STRING,
			description: "A detailed description of the feature.",
		},
		language: {
			type: Type.STRING,
			description: "The programming language that the user wants to use.",
		},
		dependencies: {
			type: Type.ARRAY,
			items: {
				type: Type.STRING,
			},
			description: "The dependencies that the user wants to use.",
		},
		inputSpec: InputSpecItemSchema,
		outputSpec: OutputSpecItemSchema,
		constraints: {
			type: Type.ARRAY,
			items: {
				type: Type.STRING,
			},
			description: "The constraints that the user wants to use.",
		},
		errorHandling: {
			type: Type.STRING,
			description: "The error handling strategy that the user wants to use.",
		},
		testCases: {
			type: Type.ARRAY,
			items: {
				type: Type.ARRAY,
				items: {
					type: Type.OBJECT,
					properties: {
						input: InputSpecItemSchema,
						output: OutputSpecItemSchema,
					},
				},
			},
			description: "The test cases that the user wants to use.",
		},
		notes: {
			type: Type.STRING,
			description: "The notes that the user wants to use.",
		},
	},
	required: [
		"feature",
		"description",
		"language",
		"dependencies",
		"inputSpec",
		"outputSpec",
		"constraints",
		"errorHandling",
		"testCases",
	],
};
