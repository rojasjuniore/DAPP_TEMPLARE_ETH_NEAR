import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PausableComponent } from './pausable.component';

describe('PausableComponent', () => {
  let component: PausableComponent;
  let fixture: ComponentFixture<PausableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PausableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PausableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
