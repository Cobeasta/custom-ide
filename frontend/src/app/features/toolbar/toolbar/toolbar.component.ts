import { Component } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  imports: [],
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class Toolbar {
  showFileMenu = false;

  toggleFileMenu() {
    this.showFileMenu = !this.showFileMenu;
  }
  async openFolder() {
    this.showFileMenu = false;
    // ask backend for open folder dialog
    const folderPath = await invoke<string>('open_folder_dialog');
    console.log('Selected folder: ', folderPath);
  }
}
