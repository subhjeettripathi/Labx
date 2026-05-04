import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceRedressalMechanismComponent } from './grievance-redressal-mechanism.component';

describe('GrievanceRedressalMechanismComponent', () => {
  let component: GrievanceRedressalMechanismComponent;
  let fixture: ComponentFixture<GrievanceRedressalMechanismComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceRedressalMechanismComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceRedressalMechanismComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
