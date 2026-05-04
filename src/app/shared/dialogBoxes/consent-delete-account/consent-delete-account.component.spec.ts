import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentDeleteAccountComponent } from './consent-delete-account.component';

describe('ConsentDeleteAccountComponent', () => {
  let component: ConsentDeleteAccountComponent;
  let fixture: ComponentFixture<ConsentDeleteAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentDeleteAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentDeleteAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
