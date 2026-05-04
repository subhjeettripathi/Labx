import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdultAgePopupComponent } from './adult-age-popup.component';

describe('AdultAgePopupComponent', () => {
  let component: AdultAgePopupComponent;
  let fixture: ComponentFixture<AdultAgePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdultAgePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdultAgePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
