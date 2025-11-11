import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import {  FileNode } from '../models/editor-state.model';
import { FileioService } from './fileio-service';
import { ask } from '@tauri-apps/plugin-dialog';
@Injectable({
  providedIn: 'root',
})
export class EditorState {
  constructor(private fileio: FileioService) { };

  private _rootFolder = new BehaviorSubject<FileNode | null>(null);
  rootFolder$ = this._rootFolder.asObservable();


  async openFolder(path: string | null | undefined) {
    const safePath = path ?? '';
    if (!safePath) return;
    const rootChildren = await this.loadChildren(safePath);
    const root: FileNode = {
      name: this.extractFolderName(safePath),
      path: safePath,
      isDir: true,
      children: rootChildren
    }
    console.log(`children: ${rootChildren.length}`);
    this._rootFolder.next(root);

  }
  private extractFolderName(path: string | null | undefined): string {
    const safePath = path ?? '';
    return safePath.split(/[\\/]/).pop() ?? safePath;
  }
  async loadChildren(path: string) {
    return this.fileio.getFolderChildren(path);
  }
  
  async loadFile(path: string): Promise<string> {
    return this.fileio.openFile(path);
  }

  saveFile(path: string, content: string) {
    this.fileio.saveFile(path, content);
  }


}
