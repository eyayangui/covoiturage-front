import { Component, OnInit } from '@angular/core';
import { Annonce } from 'src/app/Models/Annonce';
import { Router } from '@angular/router';

import { AnnouncementService } from 'src/app/services/announcement/announcement.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  annoncements : Annonce[] = [];
  

  constructor(private announcementService: AnnouncementService, private router: Router) { }

  ngOnInit(): void {
    this.availableannouncement();
  }

  getAnnouncement(): void {
    this.announcementService.getAnnouncement().subscribe(
      annoncements => {
        this.annoncements = annoncements;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }
  deleteAnnouncement(AnnonceID: any): void {
    this.announcementService.deleteAnnouncement(AnnonceID).subscribe(
      () => {
        this.router.navigate(['/event']);
      },
      error => {
        console.error('Error deleting event:', error);
      }
    );
  }
  availableannouncement(): void {
    this.announcementService.availableannouncement().subscribe(
      events => {
        if (events.length === 0) {
          this.annoncements = [];
        } else {
          this.annoncements = events;
        }
      },
      error => {
        console.error('Error fetching planned events:', error);
      }
    );
  }

}
