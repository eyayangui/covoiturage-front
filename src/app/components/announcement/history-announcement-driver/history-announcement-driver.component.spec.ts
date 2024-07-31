import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAnnouncementDriverComponent } from './history-announcement-driver.component';

describe('HistoryAnnouncementDriverComponent', () => {
  let component: HistoryAnnouncementDriverComponent;
  let fixture: ComponentFixture<HistoryAnnouncementDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryAnnouncementDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryAnnouncementDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
