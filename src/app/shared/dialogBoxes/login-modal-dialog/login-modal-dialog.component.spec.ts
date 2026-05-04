import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginModalDialogComponent } from './login-modal-dialog.component';

describe('LoginModalDialogComponent', () => {
  let component: LoginModalDialogComponent;
  let fixture: ComponentFixture<LoginModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginModalDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
