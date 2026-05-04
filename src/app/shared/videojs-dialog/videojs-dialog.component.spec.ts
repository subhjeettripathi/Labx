import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojsDialogComponent } from './videojs-dialog.component';

describe('VideojsDialogComponent', () => {
  let component: VideojsDialogComponent;
  let fixture: ComponentFixture<VideojsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideojsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideojsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
