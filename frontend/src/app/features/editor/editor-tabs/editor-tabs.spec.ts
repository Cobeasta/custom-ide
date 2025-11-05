import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorTabs } from './editor-tabs';

describe('EditorTabs', () => {
  let component: EditorTabs;
  let fixture: ComponentFixture<EditorTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorTabs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorTabs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
