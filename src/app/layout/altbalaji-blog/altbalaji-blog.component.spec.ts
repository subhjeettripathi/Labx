import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ALTBalajiBlogComponent } from './altbalaji-blog.component';

describe('ALTBalajiBlogComponent', () => {
  let component: ALTBalajiBlogComponent;
  let fixture: ComponentFixture<ALTBalajiBlogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ALTBalajiBlogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ALTBalajiBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
