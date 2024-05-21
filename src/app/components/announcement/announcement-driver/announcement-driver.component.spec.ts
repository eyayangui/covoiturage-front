import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementDriverComponent } from './announcement-driver.component';

describe('AnnouncementDriverComponent', () => {
  let component: AnnouncementDriverComponent;
  let fixture: ComponentFixture<AnnouncementDriverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnnouncementDriverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementDriverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
