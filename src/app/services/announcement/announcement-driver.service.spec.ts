import { TestBed } from '@angular/core/testing';

import { AnnouncementDriverService } from './announcement-driver.service';

describe('AnnouncementDriverService', () => {
  let service: AnnouncementDriverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementDriverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
