import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellLimitComponent } from './sell-limit.component';

describe('SellLimitComponent', () => {
  let component: SellLimitComponent;
  let fixture: ComponentFixture<SellLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SellLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
