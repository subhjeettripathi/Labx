import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmOtpmodalDialogComponent } from './paytm-otpmodal-dialog.component';

describe('PaytmOtpmodalDialogComponent', () => {
  let component: PaytmOtpmodalDialogComponent;
  let fixture: ComponentFixture<PaytmOtpmodalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytmOtpmodalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytmOtpmodalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
