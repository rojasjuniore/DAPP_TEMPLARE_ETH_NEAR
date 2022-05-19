import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyLimitComponent } from './buy-limit.component';

describe('BuyLimitComponent', () => {
  let component: BuyLimitComponent;
  let fixture: ComponentFixture<BuyLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
