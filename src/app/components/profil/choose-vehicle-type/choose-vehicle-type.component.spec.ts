import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseVehicleTypeComponent } from './choose-vehicle-type.component';

describe('ChooseVehicleTypeComponent', () => {
  let component: ChooseVehicleTypeComponent;
  let fixture: ComponentFixture<ChooseVehicleTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseVehicleTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseVehicleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
