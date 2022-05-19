import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetValueAddressComponent } from './set-value-address.component';

describe('SetValueAddressComponent', () => {
  let component: SetValueAddressComponent;
  let fixture: ComponentFixture<SetValueAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetValueAddressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetValueAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
