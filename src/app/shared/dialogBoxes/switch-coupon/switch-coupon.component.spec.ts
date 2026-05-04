import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwitchCouponComponent } from './switch-coupon.component';

describe('SwitchCouponComponent', () => {
  let component: SwitchCouponComponent;
  let fixture: ComponentFixture<SwitchCouponComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwitchCouponComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchCouponComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
