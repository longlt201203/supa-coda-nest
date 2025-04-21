import {
	Controller,
	Param,
	Body,
	Query,
	Post,
	Get,
	Delete,
} from "@nestjs/common";
import { ProjectService } from "./project.service";
import { CreateProjectRequest, ProjectQuery, ProjectResponse } from "./dto";
import { ApiResponseDto } from "@utils";

@Controller("project")
export class ProjectController {
	constructor(private readonly projectService: ProjectService) {}

	@Post()
	async createOne(@Body() dto: CreateProjectRequest) {
		await this.projectService.createOne(dto);
		return new ApiResponseDto(null, null, "Created successfully");
	}

	@Get()
	async findMany(@Query() query: ProjectQuery) {
		const data = await this.projectService.findMany(query);
		return new ApiResponseDto(ProjectResponse.fromEntities(data));
	}

	@Get(":id")
	async findOne(@Param("id") id: string) {
		const data = await this.projectService.findOne(+id, true);
		return new ApiResponseDto(ProjectResponse.fromEntity(data));
	}

	@Delete(":id")
	async deleteOne(@Param("id") id: string) {
		await this.projectService.deleteOne(+id);
		return new ApiResponseDto(null, null, "Deleted successfully");
	}
}
