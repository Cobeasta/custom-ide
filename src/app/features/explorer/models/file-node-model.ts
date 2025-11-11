import { FileNode } from "../../../core/models/editor-state.model";

export interface ExplorerNode {
   fileNode: FileNode;
   depth: number;
   expanded: boolean;
   loading: boolean;
   children: ExplorerNode[];

}