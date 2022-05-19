import { TestBed } from '@angular/core/testing';

import { ContractNearService } from './contract-near.service';

describe('ContractNearService', () => {
  let service: ContractNearService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContractNearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
