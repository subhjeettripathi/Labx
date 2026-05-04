import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherQueryModalDialogComponent } from './other-query-modal-dialog.component';

describe('OtherQueryModalDialogComponent', () => {
  let component: OtherQueryModalDialogComponent;
  let fixture: ComponentFixture<OtherQueryModalDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherQueryModalDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherQueryModalDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
