import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicVideosComponent } from './music-videos.component';

describe('MusicVideosComponent', () => {
  let component: MusicVideosComponent;
  let fixture: ComponentFixture<MusicVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusicVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
