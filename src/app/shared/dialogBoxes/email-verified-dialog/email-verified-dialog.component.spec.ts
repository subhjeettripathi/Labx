import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailVerifiedDialogComponent } from './email-verified-dialog.component';

describe('EmailVerifiedDialogComponent', () => {
  let component: EmailVerifiedDialogComponent;
  let fixture: ComponentFixture<EmailVerifiedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailVerifiedDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailVerifiedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
