import { TestBed } from '@angular/core/testing';

import { FileioService } from './fileio-service';

describe('FileioService', () => {
  let service: FileioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
