import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeographicalInformationComponent } from './geographical-information.component';

describe('GeographicalInformationComponent', () => {
  let component: GeographicalInformationComponent;
  let fixture: ComponentFixture<GeographicalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeographicalInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeographicalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
