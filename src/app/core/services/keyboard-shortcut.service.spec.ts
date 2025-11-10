import { TestBed } from '@angular/core/testing';

import { KeyboardShortcutService } from './keyboard-shortcut.service';

describe('KeyboardShortcut', () => {
  let service: KeyboardShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
