import { Component } from '@angular/core';
import { EditorState } from '../../../core/services/editor-state';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { EditorService } from '../editor.service';
@Component({
  selector: 'app-editor-tabs',
  imports: [NgIf, NgFor, AsyncPipe],
  templateUrl: './editor-tabs.html',
  styleUrl: './editor-tabs.css',
  standalone: true
})
export class EditorTabs {
  constructor(public editorService: EditorService) {}

  onSelectTab(i: number) {
    this.editorService.setActiveTab(i);
  }
  onCloseTab(i: number, event: MouseEvent) {
   this.editorService.closeTab(i); 
  }
}
