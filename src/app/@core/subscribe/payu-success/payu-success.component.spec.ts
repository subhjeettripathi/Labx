import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayuSuccessComponent } from './payu-success.component';

describe('PayuSuccessComponent', () => {
  let component: PayuSuccessComponent;
  let fixture: ComponentFixture<PayuSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PayuSuccessComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayuSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
