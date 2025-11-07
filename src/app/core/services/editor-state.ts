import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { EditorTab, FileNode, FolderState } from '../models/editor-state.model';
import { FileioService } from './fileio-service';
import { ask } from '@tauri-apps/plugin-dialog';
@Injectable({
  providedIn: 'root',
})
export class EditorState {
  constructor(private fileio: FileioService) { };

  private _folder = new BehaviorSubject<FileNode | null>(null);
  rootFolder$ = this._folder.asObservable();

  private _tabs = new BehaviorSubject<EditorTab[]>([]);
  tabs$ = this._tabs.asObservable();

  private _activeIndex = new BehaviorSubject<number | null>(null);
  activeIndex$ = this._activeIndex.asObservable();
  activeTab$ = combineLatest<[EditorTab[], number | null]>([this.tabs$, this.activeIndex$]).pipe(
    map(([tabs, index]: [EditorTab[], number | null]) => {
      return (index != null ? tabs[index] : null);
    }));


  get tabs(): EditorTab[] {
    return this._tabs.value;
  }

  async openFolder(path: string | null | undefined) {
    const safePath = path ?? '';
    if (!safePath) return;
    const rootChildren = await this.fileio.getFolderChildren(safePath);
    const root: FileNode = {
      name: this.extractFolderName(safePath),
      path: safePath,
      isDir: true,
      expanded: true,
      children: rootChildren
    }
    console.log(`children: ${rootChildren.length}`);
    this._folder.next(root);

  }
  private extractFolderName(path: string | null | undefined): string {
    const safePath = path ?? '';
    return safePath.split(/[\\/]/).pop() ?? safePath;
  }
  async toggleNode(node: FileNode) {
    console.log(`toggle folder: ${node.name}`)

    if (node.expanded) {
      node.expanded = false;
    }
    else {
      if (!node.children || node.children.length === 0) {
        const expanded = await this.fileio.getFolderChildren(node.path);
        node.children = expanded;
      }
      node.expanded = true;
    }
    console.log(`Folder ${node.name} expanded: ${node.expanded}`);
    const updatedRoot = structuredClone(this._folder.value!);
    this._folder.next(updatedRoot);

  }
  async openFile(node: FileNode): Promise<string> {
    if (node.isDir) return ''; // guard, cannot open folder
    console.log(`Open file: {node.path}`);
    const fileData = await this.fileio.openFile(node.path);

    const index = this._tabs.value.findIndex((t: { path: any; }) => t.path === node.path);


    if (index >= 0) {
      this._activeIndex.next(index);
    } else {
      const tab = {
        name: node.name,
        path: node.path,
        content: fileData,
        isDirty: false
      };
      const updatedTabs = [...this.tabs, tab];
      this._tabs.next(updatedTabs);
      this._activeIndex.next(this._tabs.value.findIndex((t: { path: any }) => t.path === node.path));
    }
    console.log(fileData);
    return fileData;
  }
  setActiveTab(index: number) {
    const updateTabs = [...this.tabs];
    if (index < 0 || index >= this.tabs.length) return; // guard
    this._activeIndex.next(index);
  }
  saveActiveTab() {
    const index = this._activeIndex.value ?? -1;
    if (index < 0) {
      return;
    }
    const tab = this._tabs.value[index];
    this.fileio.saveFile(tab.path, tab.content);
    tab.isDirty = false;
    const updatedTabs = [...this.tabs];
    this._tabs.next(updatedTabs);
  }
  async closeTab(i: number) {
    let tab = this.tabs[i];
    if (tab.isDirty) {
      console.log("Dirty");
      const answer = await ask('Discard changes?', {
        title: 'Discard Changes?',
        kind: 'warning',
      });
      console.log(answer);
      if (!answer) {
        return;
      }
    }
    let updatedTabs = [...this.tabs];
    updatedTabs.splice(i, 1);
    let newActive = this._activeIndex.value;
    if (this.tabs.length === 0) newActive = null;
    else if (newActive !== null && i <= newActive) {
      newActive = Math.max(0, newActive - 1);
    }
    this._tabs.next(updatedTabs);
    this._activeIndex.next(newActive);
  }

}
