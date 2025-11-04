import { Component } from '@angular/core';
import { invoke } from "@tauri-apps/api/core";
import { CommonModule } from '@angular/common';
import { open } from '@tauri-apps/plugin-dialog';
@Component({
  selector: 'app-toolbar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class Toolbar {
  showFileMenu = false;

  toggleFileMenu() {
    this.showFileMenu = !this.showFileMenu;
  }
  async openFolder(event?: MouseEvent) {
    console.log("open folder");
    this.showFileMenu = false;
    // ask backend for open folder dialog
    const folderPath = await open({
      directory: true,
      multiple: false,
      title: 'Open project folder'
    });
    console.log('Selected folder: ', folderPath);
  }
}
