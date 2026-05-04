import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentQueryModalDialogComponent } from './payment-query-modal-dialog.component';

describe('PaymentQueryModalDialogComponent', () => {
  let component: PaymentQueryModalDialogComponent;
  let fixture: ComponentFixture<PaymentQueryModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentQueryModalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentQueryModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
