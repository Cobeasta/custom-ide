import { Component } from '@angular/core';
import { EditorState } from '../../../core/services/editor-state';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
@Component({
  selector: 'app-editor-tabs',
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './editor-tabs.html',
  styleUrl: './editor-tabs.css',
  standalone: true
})
export class EditorTabs {
  constructor(public editor: EditorState) {}

  onSelectTab(i: number) {
    this.editor.setActiveTab(i);
  }
  onCloseTab(i: number, event: MouseEvent) {
   this.editor.closeTab(i); 
  }
}
