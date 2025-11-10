import { DOCUMENT, Inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type ShortcutCallback = () => void;

interface Shortcut {
  keyCombo: string;
  callback: ShortcutCallback;
  scope?: string;
}
@Injectable({
  providedIn: 'root',
})
export class KeyboardShortcutService {
  
 private shortcuts: Shortcut[] = [];
 private activeScope: string = 'global';
 public shortcutPressed$ = new Subject<Shortcut>();
 
 constructor(@Inject(DOCUMENT) private document: Document) {
  this.listen();
  document.addEventListener('click', this.handleClick.bind(this));
 }
  private handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('[focus-scope="editor"]')) {
      this.setScope('editor');
    } else if (target.closest('[focus-scope="explorer"]')) {
      this.setScope('explorer');
    } else {
      this.setScope('global');
    }
  }

 registerShortcut(keyCombo: string, callback: ShortcutCallback, scope: string = 'global') {
  this.shortcuts.push({keyCombo: keyCombo.toLowerCase(), callback, scope});
 }
 setScope(scope: string) {
  console.log(`setScope(${scope})`);
  this.activeScope = scope;
 }
 private listen() {
  document.addEventListener('keydown', (e: KeyboardEvent) => {

    const combo = `${e.ctrlKey ? 'ctrl+': ''}${e.shiftKey ? 'shift+' : ''}${e.altKey ? 'alt+': ''}${e.key.toLowerCase()}`
    console.log(`event: ${combo}`);
    const matched = this.shortcuts.find(s => s.keyCombo === combo && (s.scope === this.activeScope || s.scope === 'global'));
    if(matched) {
      e.preventDefault();
      matched.callback();
      this.shortcutPressed$.next(matched);
    }
 });
 }
}
