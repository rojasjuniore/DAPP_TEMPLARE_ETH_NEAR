import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeTokenPerEthComponent } from './change-token-per-eth.component';

describe('ChangeTokenPerEthComponent', () => {
  let component: ChangeTokenPerEthComponent;
  let fixture: ComponentFixture<ChangeTokenPerEthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeTokenPerEthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeTokenPerEthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
