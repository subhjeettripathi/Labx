import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazypayDialogMobileOtpComponent } from './lazypay-dialog-mobile-otp.component';

describe('LazypayDialogMobileOtpComponent', () => {
  let component: LazypayDialogMobileOtpComponent;
  let fixture: ComponentFixture<LazypayDialogMobileOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazypayDialogMobileOtpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LazypayDialogMobileOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
