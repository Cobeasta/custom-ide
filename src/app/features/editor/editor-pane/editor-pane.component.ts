import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as monaco from 'monaco-editor';
import { Subscription } from 'rxjs';
import { EditorState } from '../../../core/services/editor-state';
import { CommonModule } from '@angular/common';
import { KeyboardShortcutService } from '../../../core/services/keyboard-shortcut.service';
import { EditorService } from '../editor.service';
import { EditorTabModel } from '../models/editor-tab-model';
import { EventBusService } from '../../../core/services/event-bus.service';

@Component({
  selector: 'app-editor-pane',
  templateUrl: './editor-pane.component.html',
  styleUrls: ['./editor-pane.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EditorPaneComponent implements AfterViewInit {
  @ViewChild('editorContainer', { static: true }) container!: ElementRef;
  editor!: monaco.editor.IStandaloneCodeEditor;
  private models = new Map<string, monaco.editor.ITextModel>();
  private sub?: Subscription;
  private subFocus?: Subscription;
  private activeTab?: EditorTabModel;
  constructor(
    public editorService: EditorService,
    private shortcuts: KeyboardShortcutService,
    private bus: EventBusService
  ) { }
  get hasActiveTab(): boolean {
    console.log(this.editorService.tabs.length);
    return this.editorService.tabs.length > 0;
  }
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

    this.sub = this.editorService.activeTab$.subscribe((tab: EditorTabModel | null) => {
      console.log('Active tab update');
      if (!tab) return;
      this.activeTab = tab;
      let model = this.models.get(tab.fileNode.path);

      if (!model) {
        model = monaco.editor.createModel(
          tab.content ?? '',
          this.getLanguageFromPath(tab.fileNode.path)
        )
        this.models.set(tab.fileNode.path, model);
      }

      console.log(`new model. content: ${tab.content}`);
      this.editor.setModel(model);

      this.editor.onDidChangeModelContent(this.onModelContentChanged);
    });
    this.subFocus =  this.editorService.focus$.subscribe((val) => {
      if(val) {
        this.editor.focus();
      }
    })
  }
  private getLanguageFromPath(path: string): string {
    if (path.endsWith('.ts')) return 'typescript';
    if (path.endsWith('.js')) return 'javascript';
    if (path.endsWith('.json')) return 'json';
    if (path.endsWith('.html')) return 'html';
    if (path.endsWith('.css')) return 'css';
    return 'plaintext';
  }
  /** helper for later state integration */
  getValue(): string {
    return this.editor.getValue();
  }

  setValue(code: string) {
    this.editor.setValue(code);
  }
  onModelContentChanged = () => {
    const model = this.editor.getModel();
    if (!model) return;
    const content = model.getValue();
    if (this.activeTab) {
      this.activeTab.content = content;
      this.activeTab.dirty = true;
    }
  };

  ngOnInit() {
    this.shortcuts.registerShortcut('ctrl+s', () => this.editorService.saveActiveTab(), 'editor');
    this.shortcuts.registerShortcut('ctrl+w', () => this.editorService.closeActiveTab(), 'editor');
  }
  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.models.forEach(model => model.dispose());
    this.models.clear();
    console.log("editor pane component cleaned up");
  }
  activateScope() {
    this.shortcuts.setScope('editor');
    this.editor.focus();

  }
}
