import { GoogleGenAI } from "@google/genai";
import { Env } from "./env";

export const genAI = new GoogleGenAI({
	apiKey: Env.GOOGLE_API_KEY,
});
