import { Injectable } from '@angular/core';
import { EditorState } from '../../core/services/editor-state';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { EditorTabModel } from './models/editor-tab-model';
import { FileNode } from '../../core/models/editor-state.model';
import { ask } from '@tauri-apps/plugin-dialog';
import { EventBusService } from '../../core/services/event-bus.service';

@Injectable({
  providedIn: 'root',
})
export class EditorService {
  constructor(private editorState: EditorState, private bus: EventBusService) {
    this.activeTab$.subscribe(tab => (this._activeTab = tab));

    this.bus.on('file:open').subscribe(async ({ node }) => {
      await this.openFile(node);
    });
    this.bus.on('focus:editor').subscribe(async ( { }) => {
      this.setFocus(true);
    })
  }

  private _tabs = new BehaviorSubject<EditorTabModel[]>([]);
  tabs$ = this._tabs.asObservable();

  private _activeIndex = new BehaviorSubject<number | null>(null);
  activeIndex$ = this._activeIndex.asObservable();

  private _focus = new BehaviorSubject<boolean>(false);
  focus$ = this._focus.asObservable();

  private _activeTab: EditorTabModel | null = null;
  activeTab$ = combineLatest<[EditorTabModel[], number | null]>([this.tabs$, this.activeIndex$]).pipe(
    map(([tabs, index]) => {
      return (index != null ? tabs[index] : null);
    })
  )

  get activeTab(): EditorTabModel | null {
    return this._activeTab;
  }


  get tabs(): EditorTabModel[] {
    return this._tabs.value;
  }
  async openFile(node: FileNode): Promise<string> {
    if (node.isDir) return ''; // guard, cannot open folder
    console.log(`Open file: ${node.path}`);
    const fileData = await this.editorState.loadFile(node.path);


    const index = this._tabs.value!.findIndex((etm) => etm.fileNode.path === node.path);
    console.log('Index: ', index, 'path: ', node.path);
    if (index >= 0) {
      this._activeIndex.next(index);
    } else {
      const tab: EditorTabModel ={
        fileNode: node,
        content: fileData,
        dirty: false,
        name: node.name
      };
      this._tabs.next([...this._tabs.value, tab]);
      let idx = this._tabs.value.findIndex((etm) => etm.fileNode.path ===node.path);
      this._activeIndex.next(idx);
    }
    console.log(fileData);
    return fileData;
  }
  private emitChange() {
    const root = structuredClone(this.editorState['_rootFolder'].value);
    this.editorState['_rootFolder'].next(root);
  }

  setActiveTab(index: number) {
    if (index < 0 || index > this._tabs.value.length) return; // guard
    this._activeIndex.next(index);
  }
  async saveActiveTab() {
    console.log('saveActiveTab');
    const path = this._activeTab?.fileNode.path;
    const content = this._activeTab?.content ?? '';
    if (!path) return;
    if (this._activeTab?.dirty) {
      console.log('Dirty');
      const answer = await ask('Discard changes?', {
        title: 'Discard changes?',
        kind: 'warning',
      });
      console.log(answer);
      if (!answer) return;
    }
    this.editorState.saveFile(path, content);
  }
  async closeTab(i: number) {
    console.log(`CloseTab: ${i}`);
    let tab = this.tabs[i];
    if (tab.dirty) {
      console.log('dirty');
      const answer = await ask('Discard changes?', {
        title: 'Discard chagnes?',
        kind: 'warning',
      });
      console.log(answer);
      if (!answer) return;
    }

    let updatedTabs = [...this.tabs];
    updatedTabs.splice(i, 1);
    let newActive = this._activeIndex.value;
    if (updatedTabs.length === 0) {
      newActive = null;
    }
    else if (newActive !== null && i <= newActive) {
      newActive = Math.max(0, newActive - 1);
    }
    this._tabs.next(updatedTabs);
    this._activeIndex.next(newActive);
  }
  async closeActiveTab() {
    let val = this._activeIndex.value;
    if (val && val >= 0) {
      this.closeTab(val);
    }
  }
  setFocus(val: boolean) {
    this._focus.next(val);
  }
}
