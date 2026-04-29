import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageStackingComponent } from './package-stacking.component';

describe('PackageStackingComponent', () => {
  let component: PackageStackingComponent;
  let fixture: ComponentFixture<PackageStackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageStackingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageStackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
