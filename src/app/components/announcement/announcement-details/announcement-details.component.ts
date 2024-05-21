import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';

@Component({
  selector: 'app-announcement-details',
  templateUrl: './announcement-details.component.html',
  styleUrls: ['./announcement-details.component.css']
})
export class AnnouncementDetailsComponent implements OnInit {
  announcement: AnnouncementDriver | undefined;
  showModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private announcementDriverService: AnnouncementDriverService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getAnnouncementDriverById(+id);
    }
  }

  getAnnouncementDriverById(id: number): void {
    this.announcementDriverService.getAnnouncementDriverById(id).subscribe(
      (announcementDetails: AnnouncementDriver) => {
        this.announcement = announcementDetails;
        this.showModal = true; // Open the modal once data is fetched
      },
      error => {
        console.error('Error fetching announcement details:', error);
      }
    );
  }

  closeModal(): void {
    this.showModal = false;
  }
}
