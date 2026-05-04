import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryRestrictionComponent } from './country-restriction.component';

describe('CountryRestrictionComponent', () => {
  let component: CountryRestrictionComponent;
  let fixture: ComponentFixture<CountryRestrictionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountryRestrictionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountryRestrictionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
