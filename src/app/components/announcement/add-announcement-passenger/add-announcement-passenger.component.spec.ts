import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnouncementPassengerComponent } from './add-announcement-passenger.component';

describe('AddAnnouncementPassengerComponent', () => {
  let component: AddAnnouncementPassengerComponent;
  let fixture: ComponentFixture<AddAnnouncementPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAnnouncementPassengerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnnouncementPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
