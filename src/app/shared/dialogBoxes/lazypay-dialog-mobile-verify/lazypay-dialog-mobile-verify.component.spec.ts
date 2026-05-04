import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LazypayDialogMobileVerifyComponent } from './lazypay-dialog-mobile-verify.component';

describe('LazypayDialogMobileVerifyComponent', () => {
  let component: LazypayDialogMobileVerifyComponent;
  let fixture: ComponentFixture<LazypayDialogMobileVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LazypayDialogMobileVerifyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LazypayDialogMobileVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
