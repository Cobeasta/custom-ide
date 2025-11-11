import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileNode } from '../models/editor-state.model';

export interface AppEvents {
  'file:open': { node: FileNode };
}

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private subjects = new Map<keyof AppEvents, Subject<any>>();
  emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]) {
    if (!this.subjects.has(event)) {
      this.subjects.set(event, new Subject<AppEvents[K]>());
    }
    this.subjects.get(event)!.next(payload);
  }

  /** Subscribe to a typed event */
  on<K extends keyof AppEvents>(event: K): Observable<AppEvents[K]> {
    if (!this.subjects.has(event)) {
      this.subjects.set(event, new Subject<AppEvents[K]>());
    }
    return this.subjects.get(event)!.asObservable();
  }
}
