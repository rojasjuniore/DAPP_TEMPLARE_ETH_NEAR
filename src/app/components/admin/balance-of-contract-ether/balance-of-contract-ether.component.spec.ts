import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceOfContractEtherComponent } from './balance-of-contract-ether.component';

describe('BalanceOfContractEtherComponent', () => {
  let component: BalanceOfContractEtherComponent;
  let fixture: ComponentFixture<BalanceOfContractEtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceOfContractEtherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceOfContractEtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
