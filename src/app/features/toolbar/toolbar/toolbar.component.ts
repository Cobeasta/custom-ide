import { Component } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";
import { CommonModule } from '@angular/common';
import { open } from '@tauri-apps/plugin-dialog';
import { EditorState } from '../../../core/services/editor-state';
@Component({
  selector: 'app-toolbar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class Toolbar {
  constructor(private state: EditorState){}
  showFileMenu = false;

  toggleFileMenu() {
    console.log("toggle file menu");
    this.showFileMenu = !this.showFileMenu;
  }
  async openFolder(event?: MouseEvent) {
    this.showFileMenu = false;
    // ask backend for open folder dialog
    const folderPath = await open({
      directory: true,
      multiple: false,
      title: 'Open project folder'
    });
    this.state.openFolder(folderPath);
  }
  async save(event?: MouseEvent) {
    this.showFileMenu = false;
    this.state.saveActiveTab();
  }
}
