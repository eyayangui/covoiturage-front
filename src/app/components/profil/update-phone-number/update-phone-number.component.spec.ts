import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePhoneNumberComponent } from './update-phone-number.component';

describe('UpdatePhoneNumberComponent', () => {
  let component: UpdatePhoneNumberComponent;
  let fixture: ComponentFixture<UpdatePhoneNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatePhoneNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePhoneNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
