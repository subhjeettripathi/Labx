import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyParentalPinComponent } from './verify-parental-pin.component';

describe('VerifyParentalPinComponent', () => {
  let component: VerifyParentalPinComponent;
  let fixture: ComponentFixture<VerifyParentalPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyParentalPinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyParentalPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
