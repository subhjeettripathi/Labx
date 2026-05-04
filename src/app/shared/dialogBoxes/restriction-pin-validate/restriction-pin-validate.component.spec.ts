import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionPinValidateComponent } from './restriction-pin-validate.component';

describe('RestrictionPinValidateComponent', () => {
  let component: RestrictionPinValidateComponent;
  let fixture: ComponentFixture<RestrictionPinValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictionPinValidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionPinValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
