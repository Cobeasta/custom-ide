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
    monaco.editor.defineTheme('darkTealIndigo', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', background: '0D444C', foreground: 'F4F8F5' },
        { token: 'comment', foreground: '9CB2B5', fontStyle: 'italic' },
        { token: 'keyword', foreground: '2B823A' },
        { token: 'string', foreground: 'A9C562' },
        { token: 'number', foreground: '0F5F1D' },
        { token: 'delimiter', foreground: '246068' },
      ],
      colors: {
        'editor.background': '#0D444C',
        'editor.foreground': '#F4F8F5',
        'editorLineNumber.foreground': '#6FA5AD',
        'editorLineNumber.activeForeground': '#A9C562',
        'editorCursor.foreground': '#A9C562',
        'editor.selectionBackground': '#24606899',
        'editor.lineHighlightBackground': '#001B1F55',
        'editorBracketMatch.background': '#00270755',
        'editorBracketMatch.border': '#00410B77',
        'scrollbarSlider.background': '#24606844',
        'scrollbarSlider.hoverBackground': '#24606877',
        'scrollbarSlider.activeBackground': '#246068AA',
      },
    });
    this.editor = monaco.editor.create(this.container.nativeElement, {
      value: '// Start coding…',
      language: 'typescript',
      theme: 'darkTealIndigo',
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
