import { TestBed } from '@angular/core/testing';

import { ExplorerShortcutsService } from './explorer-shortcuts.service';

describe('ExplorerShortcutsService', () => {
  let service: ExplorerShortcutsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExplorerShortcutsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
