import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpiModalDialogComponent } from './upi-modal-dialog.component';

describe('UpiModalDialogComponent', () => {
  let component: UpiModalDialogComponent;
  let fixture: ComponentFixture<UpiModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpiModalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpiModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
