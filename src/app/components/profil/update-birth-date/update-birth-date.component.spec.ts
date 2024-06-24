import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateBirthDateComponent } from './update-birth-date.component';

describe('UpdateBirthDateComponent', () => {
  let component: UpdateBirthDateComponent;
  let fixture: ComponentFixture<UpdateBirthDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateBirthDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateBirthDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
