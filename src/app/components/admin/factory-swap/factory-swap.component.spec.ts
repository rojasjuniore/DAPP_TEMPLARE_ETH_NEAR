import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorySwapComponent } from './factory-swap.component';

describe('FactorySwapComponent', () => {
  let component: FactorySwapComponent;
  let fixture: ComponentFixture<FactorySwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactorySwapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorySwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
