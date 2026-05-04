import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceRestrictionPopupComponent } from './device-restriction-popup.component';

describe('DeviceRestrictionPopupComponent', () => {
  let component: DeviceRestrictionPopupComponent;
  let fixture: ComponentFixture<DeviceRestrictionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeviceRestrictionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeviceRestrictionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
