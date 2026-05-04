import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayloaderComponent } from './gatewayloader.component';

describe('GatewayloaderComponent', () => {
  let component: GatewayloaderComponent;
  let fixture: ComponentFixture<GatewayloaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GatewayloaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GatewayloaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
