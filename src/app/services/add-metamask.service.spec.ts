import { TestBed } from '@angular/core/testing';

import { AddTokenAMetamaskService } from './add-metamask.service';

describe('AddTokenAMetamaskService', () => {
  let service: AddTokenAMetamaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddTokenAMetamaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
