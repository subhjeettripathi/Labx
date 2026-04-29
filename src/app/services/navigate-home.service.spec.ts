import { TestBed } from '@angular/core/testing';

import { NavigateHomeService } from './navigate-home.service';

describe('NavigateHomeService', () => {
  let service: NavigateHomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigateHomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
