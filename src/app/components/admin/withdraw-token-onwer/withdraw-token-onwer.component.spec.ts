import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithdrawTokenOnwerComponent } from './withdraw-token-onwer.component';

describe('WithdrawTokenOnwerComponent', () => {
  let component: WithdrawTokenOnwerComponent;
  let fixture: ComponentFixture<WithdrawTokenOnwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithdrawTokenOnwerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithdrawTokenOnwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
