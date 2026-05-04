import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WrongOtpPopupComponent } from './wrong-otp-popup.component';

describe('WrongOtpPopupComponent', () => {
  let component: WrongOtpPopupComponent;
  let fixture: ComponentFixture<WrongOtpPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WrongOtpPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WrongOtpPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
