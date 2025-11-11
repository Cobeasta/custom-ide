import { inject, Injectable } from '@angular/core';
import { EditorState } from '../../core/services/editor-state';
import { FileNode } from '../../core/models/editor-state.model';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { ExplorerNode } from './models/file-node-model';
import { join } from '@tauri-apps/api/path';
import { EventBusService } from '../../core/services/event-bus.service';


@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  private state = inject(EditorState);

  private _root = new BehaviorSubject<ExplorerNode | null>(null);
  rootFolder$ = this._root.asObservable();
  private expanded = new Set<string>();
  private loading = new Set<string>();
  constructor(public bus: EventBusService) {
     this.state.rootFolder$
      .pipe(map(root => root ? this.decorateNode(root, 0) : null))
      .subscribe(this._root);
   }
   private decorateNode(node: FileNode | null, depth: number): ExplorerNode | null{
    if(!node) return null;
    const expanded = this.expanded.has(node.path);
    const loading = this.loading.has(node.path);
    const children = expanded && node.children ? node.children.map(c => this.decorateNode(c, depth + 1)!): [];

    return { fileNode: node, depth, expanded, loading, children };
   }

  
  /** User clicked to toggle */
  async toggle(node: ExplorerNode): Promise<void> {
    const path = node.fileNode.path;
    if (this.expanded.has(path)) {
      this.expanded.delete(path);
      this.emitChange();
      return;
    }

    // Need to expand
    this.expanded.add(path);

    // Lazy-load if needed
    if (!node.children || node.children.length === 0) {
      this.loading.add(path);
      this.emitChange();

      const children = await this.state.loadChildren(path);
      node.fileNode.children = children;

      this.loading.delete(path);
    }

    this.emitChange();
  }
  open(node: ExplorerNode) {
    let fileNode = node.fileNode;
    this.bus.emit('file:open', {node: fileNode });
  }

  private emitChange() {
    // re-emit decorated tree by pushing new reference
    const root = structuredClone(this.state['_rootFolder'].value);
    this.state['_rootFolder'].next(root);
  }
}
