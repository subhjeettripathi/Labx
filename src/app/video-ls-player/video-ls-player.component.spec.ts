import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLsPlayerComponent } from './video-ls-player.component';

describe('VideoLsPlayerComponent', () => {
  let component: VideoLsPlayerComponent;
  let fixture: ComponentFixture<VideoLsPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLsPlayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoLsPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
