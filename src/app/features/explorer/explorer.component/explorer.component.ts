import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { FileNode } from '../../../core/models/editor-state.model';
import { ExplorerService } from '../explorer.service';
import { ExplorerNode } from '../models/file-node-model';
@Component({
  selector: 'app-explorer',
  imports: [CommonModule],
  templateUrl: './explorer.component.html',
  styleUrl: './explorer.component.css',
})
export class ExplorerComponent {
  constructor(public service: ExplorerService) { }

  private sub?: Subscription;
  currentRoot?: ExplorerNode | null;
  ngOnInit() {
    this.sub = this.service.rootFolder$.subscribe((root) => {
      this.currentRoot = root;
      console.log("explorer updated current root: ", this.currentRoot?.fileNode.name);
    });
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  toggle(node: ExplorerNode) {
    console.log(`toggle: ${node.fileNode.name} expanded: ${node.expanded}`)
    if (node.fileNode.isDir) {
      this.service.toggle(node);
    }
  }
  open(node: ExplorerNode) {
    if(!node.fileNode.isDir) {
      this.service.open(node);
    }
  }

  trackByPath(index: number, item: ExplorerNode) {
    return item.fileNode.path;
  }
}
