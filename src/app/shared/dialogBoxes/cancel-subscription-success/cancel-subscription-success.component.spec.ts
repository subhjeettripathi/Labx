import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionSuccessComponent } from './cancel-subscription-success.component';

describe('CancelSubscriptionSuccessComponent', () => {
  let component: CancelSubscriptionSuccessComponent;
  let fixture: ComponentFixture<CancelSubscriptionSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionSuccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
