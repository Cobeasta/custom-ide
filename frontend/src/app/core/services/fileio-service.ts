import { Injectable } from '@angular/core';
import { FileNode, FolderState } from '../models/editor-state.model';
import { join } from '@tauri-apps/api/path';
import {invoke} from '@tauri-apps/api/core';
@Injectable({
  providedIn: 'root',
})
export class FileioService {
 
   async getFolderChildren(path: string): Promise<FileNode[]> {
    console.log(`[FileioService] Loading: ${path}`);
    const entries = await invoke<{ name: string; path: string; is_dir: boolean }[]>(
      'read_project_dir',
      { path }
    );

    return entries.map((entry: { name: string; path: string; is_dir: boolean; }): FileNode => ({
      name: entry.name,
      path: entry.path,
      isDir: entry.is_dir,
      expanded: false,
      children: entry.is_dir ? [] : undefined,
    }));
  }

  async openFile(path: string):Promise<string> {
    return await invoke<string>('open_file', {path});
  }
}
