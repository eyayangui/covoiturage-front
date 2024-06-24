import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAnnouncementEventComponent } from './add-announcement-event.component';

describe('AddAnnouncementEventComponent', () => {
  let component: AddAnnouncementEventComponent;
  let fixture: ComponentFixture<AddAnnouncementEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAnnouncementEventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAnnouncementEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
