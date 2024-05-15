import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementPassengerComponent } from './announcement-passenger.component';

describe('AnnouncementPassengerComponent', () => {
  let component: AnnouncementPassengerComponent;
  let fixture: ComponentFixture<AnnouncementPassengerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementPassengerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementPassengerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
