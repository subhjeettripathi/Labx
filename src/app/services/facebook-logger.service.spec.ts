import { TestBed } from '@angular/core/testing';

import { FacebookLoggerService } from './facebook-logger.service';

describe('FacebookLoggerService', () => {
  let service: FacebookLoggerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacebookLoggerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
