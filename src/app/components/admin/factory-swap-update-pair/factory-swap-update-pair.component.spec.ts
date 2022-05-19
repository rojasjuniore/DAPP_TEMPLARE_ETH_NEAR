import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactorySwapUpdatePairComponent } from './factory-swap-update-pair.component';

describe('FactorySwapUpdatePairComponent', () => {
  let component: FactorySwapUpdatePairComponent;
  let fixture: ComponentFixture<FactorySwapUpdatePairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FactorySwapUpdatePairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FactorySwapUpdatePairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
