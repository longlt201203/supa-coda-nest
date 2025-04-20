import { config } from "dotenv";

config();

export const Env = {
	LISTEN_PORT: Number(process.env.LISTEN_PORT || "0"),
	DB_HOST: process.env.DB_HOST || "",
	DB_PORT: Number(process.env.DB_PORT || "0"),
	DB_NAME: process.env.DB_NAME || "",
	DB_USER: process.env.DB_USER || "",
	DB_PASS: process.env.DB_PASS || "",
	ENABLE_SWAGGER: process.env.ENABLE_SWAGGER === "true",
	GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
} as const;

console.log(Env);
