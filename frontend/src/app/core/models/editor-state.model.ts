export interface FileNode {
    name: string;
    path: string;
    isDir: boolean;
    expanded?: boolean;
    loading?: boolean;
    children?: FileNode[];
}
export interface FolderState {
    path: string;
    files: FileNode[];
}
export interface EditorTab {
    path: string;
    name: string;
    content: string;
    isDirty: boolean;
}