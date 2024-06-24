import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAnnouncementPassengerComponent } from './update-announcement-passenger.component';

describe('UpdateAnnouncementPassengerComponent', () => {
  let component: UpdateAnnouncementPassengerComponent;
  let fixture: ComponentFixture<UpdateAnnouncementPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateAnnouncementPassengerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAnnouncementPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
