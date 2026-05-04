import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentalOtpEnableComponent } from './parental-otp-enable.component';

describe('ParentalOtpEnableComponent', () => {
  let component: ParentalOtpEnableComponent;
  let fixture: ComponentFixture<ParentalOtpEnableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentalOtpEnableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentalOtpEnableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
