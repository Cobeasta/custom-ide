import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: true }) container!: ElementRef;
  editor!: monaco.editor.IStandaloneCodeEditor;

  ngAfterViewInit() {
    this.editor = monaco.editor.create(this.container.nativeElement, {
      value: '// Start coding…',
      language: 'typescript',
      theme: 'vs-dark',
      automaticLayout: true
    });
  }

  /** helper for later state integration */
  getValue(): string {
    return this.editor.getValue();
  }

  setValue(code: string) {
    this.editor.setValue(code);
  }
}
