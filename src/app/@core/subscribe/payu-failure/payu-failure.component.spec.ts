import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayuFailureComponent } from './payu-failure.component';

describe('PayuFailureComponent', () => {
  let component: PayuFailureComponent;
  let fixture: ComponentFixture<PayuFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayuFailureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayuFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
