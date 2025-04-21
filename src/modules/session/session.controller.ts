import {
	Controller,
	Param,
	Body,
	Query,
	Post,
	Get,
	Put,
	Delete,
} from "@nestjs/common";
import { SessionService } from "./session.service";
import {
	CreateSessionRequest,
	UpdateSessionRequest,
	SessionQuery,
	SessionResponse,
} from "./dto";
import { ApiResponseDto } from "@utils";

@Controller("session")
export class SessionController {
	constructor(private readonly sessionService: SessionService) {}

	@Post()
	async createOne(@Body() dto: CreateSessionRequest) {
		const session = await this.sessionService.createOne(dto);
		return new ApiResponseDto(
			SessionResponse.fromEntity(session),
			null,
			"Created successfully",
		);
	}

	@Put(":id")
	async updateOne(@Param("id") id: string, @Body() dto: UpdateSessionRequest) {
		await this.sessionService.updateOne(id, dto);
		return new ApiResponseDto(null, null, "Updated successfully");
	}

	@Get()
	async findMany(@Query() query: SessionQuery) {
		const data = await this.sessionService.findMany(query);
		return new ApiResponseDto(SessionResponse.fromEntities(data));
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		const data = await this.sessionService.findOne(id);
		return new ApiResponseDto(SessionResponse.fromEntity(data));
	}

	@Delete(":id")
	async deleteOne(@Param("id") id: string) {
		await this.sessionService.deleteOne(id);
		return new ApiResponseDto(null, null, "Deleted successfully");
	}
}
