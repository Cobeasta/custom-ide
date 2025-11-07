import { Component, HostListener} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { invoke } from "@tauri-apps/api/core";
import { ExplorerComponent } from "./features/explorer/explorer.component/explorer.component";
import { Toolbar } from "./features/toolbar/toolbar/toolbar.component";
import { EditorComponent } from "./features/editor/editor";
@Component({
  selector: "app-root",
  imports: [EditorComponent, ExplorerComponent, Toolbar],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent { 
  sidebarWidth = 250;
  dragging = false;
  startDragging(event: MouseEvent) {
    this.dragging = true;
    console.log("dragging");
    event.preventDefault();
  }

  onDrag(event: MouseEvent) {
    console.log("onDrag");
    if(!this.dragging) return;
    const newWidth = event.clientX; // distance from left edge
    if(newWidth > 100 && newWidth < 600) {
      console.log("new width");
      this.sidebarWidth = newWidth;
    }
  }
  stopDragging() {
    console.log("new width: " + this.sidebarWidth);
    this.dragging = false;
  }
  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    // prevent browser context menu
    event.preventDefault();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const key = event.key.toLocaleLowerCase();
    if(isCtrlOrCmd && ['p', 's', 'r', 'o', 'n', 't'].includes(key)) {
      event.preventDefault();
      event.stopPropagation();

    }
  }
}
