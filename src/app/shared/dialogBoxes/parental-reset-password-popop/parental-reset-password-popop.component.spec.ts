import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentalResetPasswordPopopComponent } from './parental-reset-password-popop.component';

describe('ParentalResetPasswordPopopComponent', () => {
  let component: ParentalResetPasswordPopopComponent;
  let fixture: ComponentFixture<ParentalResetPasswordPopopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentalResetPasswordPopopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentalResetPasswordPopopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
