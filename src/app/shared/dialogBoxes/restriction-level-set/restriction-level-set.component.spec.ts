import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestrictionLevelSetComponent } from './restriction-level-set.component';

describe('RestrictionLevelSetComponent', () => {
  let component: RestrictionLevelSetComponent;
  let fixture: ComponentFixture<RestrictionLevelSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestrictionLevelSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RestrictionLevelSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
