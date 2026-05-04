import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryMsgComponent } from './query-msg.component';

describe('QueryMsgComponent', () => {
  let component: QueryMsgComponent;
  let fixture: ComponentFixture<QueryMsgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryMsgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QueryMsgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
