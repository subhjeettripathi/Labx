import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionSetEmailVerifyComponent } from './restriction-set-email-verify.component';

describe('RestrictionSetEmailVerifyComponent', () => {
  let component: RestrictionSetEmailVerifyComponent;
  let fixture: ComponentFixture<RestrictionSetEmailVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictionSetEmailVerifyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionSetEmailVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
