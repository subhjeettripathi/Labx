import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearWatchingConsentComponent } from './clear-watching-consent.component';

describe('ClearWatchingConsentComponent', () => {
  let component: ClearWatchingConsentComponent;
  let fixture: ComponentFixture<ClearWatchingConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClearWatchingConsentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClearWatchingConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
