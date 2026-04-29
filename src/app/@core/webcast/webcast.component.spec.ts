import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebcastComponent } from './webcast.component';

describe('WebcastComponent', () => {
  let component: WebcastComponent;
  let fixture: ComponentFixture<WebcastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebcastComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
