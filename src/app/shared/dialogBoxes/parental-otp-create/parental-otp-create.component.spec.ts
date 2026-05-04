import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentalOtpCreateComponent } from './parental-otp-create.component';

describe('ParentalOtpCreateComponent', () => {
  let component: ParentalOtpCreateComponent;
  let fixture: ComponentFixture<ParentalOtpCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentalOtpCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentalOtpCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
