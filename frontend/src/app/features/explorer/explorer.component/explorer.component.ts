import { Component } from '@angular/core';
import { EditorState } from '../../../core/services/editor-state';
import { CommonModule } from '@angular/common';
import {Subscription} from 'rxjs';
import { FileNode } from '../../../core/models/editor-state.model';
@Component({
  selector: 'app-explorer',
  imports: [CommonModule],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css',
})
export class ExplorerComponent {
  constructor(public state: EditorState) {}

  private sub?: Subscription;
  currentRoot?: FileNode | null;
  ngOnInit() {
    this.sub = this.state.rootFolder$.subscribe((root) => {
      this.currentRoot = root;
      console.log("explorer updated current root: ", this.currentRoot?.name);
    });
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

toggle(node: FileNode) {
    this.state.toggleNode(node);
  }

  trackByPath(index: number, item: FileNode) {
    return item.path;
  }
}
