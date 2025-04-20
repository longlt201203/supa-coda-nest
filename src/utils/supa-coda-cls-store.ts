import { ClsStore } from "nestjs-cls";

export interface SupaCodaClsStore extends ClsStore {
	session: {
		id: string;
	};
}
