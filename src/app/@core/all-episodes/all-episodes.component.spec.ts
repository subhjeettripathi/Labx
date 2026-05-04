import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEpisodesComponent } from './all-episodes.component';

describe('AllEpisodesComponent', () => {
  let component: AllEpisodesComponent;
  let fixture: ComponentFixture<AllEpisodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllEpisodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllEpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
