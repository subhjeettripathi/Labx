import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactusModalDialogComponent } from './contactus-modal-dialog.component';

describe('ContactusModalDialogComponent', () => {
  let component: ContactusModalDialogComponent;
  let fixture: ComponentFixture<ContactusModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactusModalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactusModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
