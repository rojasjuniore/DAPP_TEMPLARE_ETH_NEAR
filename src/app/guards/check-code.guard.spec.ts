import { TestBed } from '@angular/core/testing';

import { CheckCodeGuard } from './check-code.guard';

describe('CheckCodeGuard', () => {
  let guard: CheckCodeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CheckCodeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
