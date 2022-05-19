import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawMaticOwnerComponent } from './withdraw-matic-owner.component';

describe('WithdrawMaticOwnerComponent', () => {
  let component: WithdrawMaticOwnerComponent;
  let fixture: ComponentFixture<WithdrawMaticOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawMaticOwnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawMaticOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
