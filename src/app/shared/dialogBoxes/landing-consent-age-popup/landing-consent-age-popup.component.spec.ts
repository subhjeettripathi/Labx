import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingConsentAgePopupComponent } from './landing-consent-age-popup.component';

describe('LandingConsentAgePopupComponent', () => {
  let component: LandingConsentAgePopupComponent;
  let fixture: ComponentFixture<LandingConsentAgePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingConsentAgePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingConsentAgePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
