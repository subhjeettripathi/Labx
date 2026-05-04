import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadmoreDialogComponent } from './readmore-dialog.component';

describe('ReadmoreDialogComponent', () => {
  let component: ReadmoreDialogComponent;
  let fixture: ComponentFixture<ReadmoreDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReadmoreDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadmoreDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
