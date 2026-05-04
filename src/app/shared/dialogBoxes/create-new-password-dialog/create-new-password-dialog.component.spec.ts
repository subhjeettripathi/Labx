import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPasswordDialogComponent } from './create-new-password-dialog.component';

describe('CreateNewPasswordDialogComponent', () => {
  let component: CreateNewPasswordDialogComponent;
  let fixture: ComponentFixture<CreateNewPasswordDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewPasswordDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewPasswordDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
