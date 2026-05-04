import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterOtpMobileComponent } from './enter-otp-mobile.component';

describe('EnterOtpMobileComponent', () => {
  let component: EnterOtpMobileComponent;
  let fixture: ComponentFixture<EnterOtpMobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterOtpMobileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterOtpMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
