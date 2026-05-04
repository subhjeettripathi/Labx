import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyParentalAlreadyRegisterComponent } from './verify-parental-already-register.component';

describe('VerifyParentalAlreadyRegisterComponent', () => {
  let component: VerifyParentalAlreadyRegisterComponent;
  let fixture: ComponentFixture<VerifyParentalAlreadyRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyParentalAlreadyRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyParentalAlreadyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
