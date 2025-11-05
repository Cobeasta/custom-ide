import { Component } from '@angular/core';
import { EditorPaneComponent } from './editor-pane/editor-pane.component';
import { EditorTabs } from './editor-tabs/editor-tabs';

@Component({
  selector: 'app-editor',
  imports: [EditorPaneComponent, EditorTabs],
  templateUrl: './editor.html',
  styleUrl: './editor.css',
})
export class EditorComponent {

}
