import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelSubscriptionAlertComponent } from './cancel-subscription-alert.component';

describe('CancelSubscriptionAlertComponent', () => {
  let component: CancelSubscriptionAlertComponent;
  let fixture: ComponentFixture<CancelSubscriptionAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CancelSubscriptionAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CancelSubscriptionAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
