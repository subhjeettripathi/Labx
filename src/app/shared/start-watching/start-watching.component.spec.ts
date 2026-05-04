import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartWatchingComponent } from './start-watching.component';

describe('StartWatchingComponent', () => {
  let component: StartWatchingComponent;
  let fixture: ComponentFixture<StartWatchingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartWatchingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartWatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
