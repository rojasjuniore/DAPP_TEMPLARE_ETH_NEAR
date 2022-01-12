import { TestBed } from '@angular/core/testing';

import { AbiService } from './abi.service';

describe('AbiService', () => {
  let service: AbiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
