import { FileNode } from "../../../core/models/editor-state.model";

export class EditorTabModel {
    constructor(
        public fileNode: FileNode,
        public content: string,
        public dirty: boolean,
    ){}
    get name(): string {
        return this.fileNode.name;
    }

}