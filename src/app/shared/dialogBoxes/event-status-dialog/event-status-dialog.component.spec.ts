import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventStatusDialogComponent } from './event-status-dialog.component';

describe('EventStatusDialogComponent', () => {
  let component: EventStatusDialogComponent;
  let fixture: ComponentFixture<EventStatusDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventStatusDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventStatusDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
