import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryLockPopupComponent } from './country-lock-popup.component';

describe('CountryLockPopupComponent', () => {
  let component: CountryLockPopupComponent;
  let fixture: ComponentFixture<CountryLockPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryLockPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryLockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
