import { TestBed } from '@angular/core/testing';

import { AnnouncementPassengerService } from './announcement-passenger.service';

describe('AnnouncementPassengerService', () => {
  let service: AnnouncementPassengerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementPassengerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
