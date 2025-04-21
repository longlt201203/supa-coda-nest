import { Injectable, NotFoundException } from "@nestjs/common";
import {
	CreateProjectRequest,
	UpdateProjectRequest,
	ProjectQuery,
	ProjectTreeNode,
} from "./dto";
import * as fs from "fs";
import * as path from "path";
import { ProjectRepository } from "@db/repositories";
import * as ignore from "ignore";

@Injectable()
export class ProjectService {
	constructor(private readonly projectRepository: ProjectRepository) {}

	private readGitignorePatterns(folderPath: string): string[] {
		const gitignorePath = path.join(folderPath, ".gitignore");
		if (fs.existsSync(gitignorePath)) {
			const content = fs.readFileSync(gitignorePath, "utf8");
			return content
				.split("\n")
				.map((line) => line.trim())
				.filter((line) => line && !line.startsWith("#"));
		}
		return [];
	}

	private analyzeFolderHierarchy(folderPath: string): ProjectTreeNode {
		const root = new ProjectTreeNode(path.basename(folderPath), folderPath);
		const files = fs.readdirSync(folderPath);

		// Read .gitignore patterns
		const ignorePatterns = this.readGitignorePatterns(folderPath);
		const ig = ignore.default().add(ignorePatterns);

		for (const file of files) {
			// Skip if file is .git
			if (file === ".git") {
				continue;
			}

			const fullPath = path.join(folderPath, file);
			const relativePath = path.relative(folderPath, fullPath);

			// Skip if file matches ignore pattern
			if (ignorePatterns.length > 0 && ig.ignores(relativePath)) {
				continue;
			}

			const stat = fs.statSync(fullPath);
			if (stat.isDirectory()) {
				root.addChild(this.analyzeFolderHierarchy(fullPath));
			} else {
				root.addChild(new ProjectTreeNode(file, fullPath));
			}
		}

		return root;
	}

	async createOne(dto: CreateProjectRequest) {
		const projectStructure = this.analyzeFolderHierarchy(dto.path);
		await this.projectRepository.save({
			name: dto.name,
			projectStructure: JSON.stringify(projectStructure),
		});
	}

	async findMany(query: ProjectQuery) {
		return await this.projectRepository.find({
			select: ["id", "name"],
		});
	}

	async findOne(id: number, fail: boolean = false) {
		const data = await this.projectRepository.findOne({ where: { id: id } });
		if (fail && !data) throw new NotFoundException("Project not found!");
		return data;
	}

	async deleteOne(id: number) {
		const project = await this.findOne(id, true);
		await this.projectRepository.delete(project.id);
	}
}
