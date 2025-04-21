export class ProjectTreeNode {
	name: string;
	path: string;
	children: ProjectTreeNode[];

	constructor(name: string, path: string) {
		this.name = name;
		this.path = path;
		this.children = [];
	}

	addChild(child: ProjectTreeNode) {
		this.children.push(child);
	}
}
