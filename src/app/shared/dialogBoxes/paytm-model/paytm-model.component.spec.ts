import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaytmModelComponent } from './paytm-model.component';

describe('PaytmModelComponent', () => {
  let component: PaytmModelComponent;
  let fixture: ComponentFixture<PaytmModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaytmModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaytmModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
