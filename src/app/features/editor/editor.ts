import { Component } from '@angular/core';
import { EditorPaneComponent } from './editor-pane/editor-pane.component';
import { EditorTabs } from './editor-tabs/editor-tabs';
import {CommonModule} from '@angular/common';
import { EditorState } from '../../core/services/editor-state';
import { map } from 'rxjs/operators';
import {Observable} from 'rxjs';
import { EditorService } from './editor.service';
@Component({
  selector: 'app-editor',
  imports: [EditorPaneComponent, EditorTabs, CommonModule],
  templateUrl: './editor.html',
  styleUrls: ['./editor.css'],
})
export class EditorComponent {
  hasTabs$!: Observable<boolean>;
  constructor(private state: EditorService){
    this.hasTabs$ = this.state.tabs$.pipe(
      map((tabs) => tabs.length > 0));

  }
  hasActiveTabs = false;
  
  }
