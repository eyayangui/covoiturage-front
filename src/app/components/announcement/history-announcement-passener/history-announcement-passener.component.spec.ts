import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryAnnouncementPassenerComponent } from './history-announcement-passener.component';

describe('HistoryAnnouncementPassenerComponent', () => {
  let component: HistoryAnnouncementPassenerComponent;
  let fixture: ComponentFixture<HistoryAnnouncementPassenerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryAnnouncementPassenerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoryAnnouncementPassenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
