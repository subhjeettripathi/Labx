import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChechPinParentalComponent } from './chech-pin-parental.component';

describe('ChechPinParentalComponent', () => {
  let component: ChechPinParentalComponent;
  let fixture: ComponentFixture<ChechPinParentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChechPinParentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChechPinParentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
