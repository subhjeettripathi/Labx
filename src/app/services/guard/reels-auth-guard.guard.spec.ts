import { TestBed } from '@angular/core/testing';

import { ReelsAuthGuardGuard } from './reels-auth-guard.guard';

describe('ReelsAuthGuardGuard', () => {
  let guard: ReelsAuthGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ReelsAuthGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
