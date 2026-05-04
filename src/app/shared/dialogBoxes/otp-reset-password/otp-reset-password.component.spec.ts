import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpResetPasswordComponent } from './otp-reset-password.component';

describe('OtpResetPasswordComponent', () => {
  let component: OtpResetPasswordComponent;
  let fixture: ComponentFixture<OtpResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtpResetPasswordComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtpResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
