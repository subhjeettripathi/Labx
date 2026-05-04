import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatePopupComponent } from './state-popup.component';

describe('StatePopupComponent', () => {
  let component: StatePopupComponent;
  let fixture: ComponentFixture<StatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
