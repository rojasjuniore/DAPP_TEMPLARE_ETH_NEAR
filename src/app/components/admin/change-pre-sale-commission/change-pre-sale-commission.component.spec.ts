import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePreSaleCommissionComponent } from './change-pre-sale-commission.component';

describe('ChangePreSaleCommissionComponent', () => {
  let component: ChangePreSaleCommissionComponent;
  let fixture: ComponentFixture<ChangePreSaleCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangePreSaleCommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePreSaleCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
