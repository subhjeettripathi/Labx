import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtitleSettingComponent } from './subtitle-setting.component';

describe('SubtitleSettingComponent', () => {
  let component: SubtitleSettingComponent;
  let fixture: ComponentFixture<SubtitleSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubtitleSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubtitleSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
