import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLinkSendVerificationComponent } from './email-link-send-verification.component';

describe('EmailLinkSendVerificationComponent', () => {
  let component: EmailLinkSendVerificationComponent;
  let fixture: ComponentFixture<EmailLinkSendVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailLinkSendVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailLinkSendVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
