import { Injectable } from '@angular/core';
import { KeyboardShortcutService } from '../../core/services/keyboard-shortcut.service';
import { Subject } from 'rxjs';


export interface ExplorerEvent {
  type: 'refresh' | 'open-file' | 'collapse-all' | 'expand-all';
  payload?: any;
}
@Injectable({
  providedIn: 'root',
})
export class ExplorerShortcutsService {
private eventSubject = new Subject<ExplorerEvent>();
public event$ = this.eventSubject.asObservable();
 constructor(private shortcuts: KeyboardShortcutService) {
  this.shortcuts.registerShortcut('arrowdown', () => this.moveSelection(1), 'explorer');
  this.shortcuts.registerShortcut('arrowup', () => this.moveSelection(-1), 'explorer');
 } 
 moveSelection(offset: number) {
  console.log('moveSelection', offset);
 }
 emit(event: ExplorerEvent) {
  this.eventSubject.next(event);
 }
 refresh() {
  this.emit({type: 'refresh'});
 }
 openFile(path: string) {
  this.emit({type: 'open-file', payload: path});
 }
 
}
