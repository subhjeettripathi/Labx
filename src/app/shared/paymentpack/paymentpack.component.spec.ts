import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentpackComponent } from './paymentpack.component';

describe('PaymentpackComponent', () => {
  let component: PaymentpackComponent;
  let fixture: ComponentFixture<PaymentpackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentpackComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentpackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
