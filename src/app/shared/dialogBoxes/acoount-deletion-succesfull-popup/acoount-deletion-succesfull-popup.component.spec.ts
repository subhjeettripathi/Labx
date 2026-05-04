import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcoountDeletionSuccesfullPopupComponent } from './acoount-deletion-succesfull-popup.component';

describe('AcoountDeletionSuccesfullPopupComponent', () => {
  let component: AcoountDeletionSuccesfullPopupComponent;
  let fixture: ComponentFixture<AcoountDeletionSuccesfullPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcoountDeletionSuccesfullPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcoountDeletionSuccesfullPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
