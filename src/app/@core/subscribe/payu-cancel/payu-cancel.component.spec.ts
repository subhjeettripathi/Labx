import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayuCancelComponent } from './payu-cancel.component';

describe('PayuCancelComponent', () => {
  let component: PayuCancelComponent;
  let fixture: ComponentFixture<PayuCancelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayuCancelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayuCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
