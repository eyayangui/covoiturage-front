import { Component, OnInit } from '@angular/core';
import { AnnouncementPassengerService } from 'src/app/services/announcement/announcement-passenger.service';
import { Router } from '@angular/router';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';


@Component({
  selector: 'app-announcement-passenger',
  templateUrl: './announcement-passenger.component.html',
  styleUrls: ['./announcement-passenger.component.css']
})
export class AnnouncementPassengerComponent implements OnInit {
  annoncements : AnnoncePassenger[] = [];
  

  constructor(private announcementPassengerService: AnnouncementPassengerService, private router: Router) { }

  ngOnInit(): void {
    this.announcementPassengerDate();
  }
  
  announcementPassengerDate(): void {
    this.announcementPassengerService.announcementPassengerDate().subscribe(
      annoncements => {
        if (this.annoncements.length === 0) {
          this.annoncements = [];
        } else {
          this.annoncements = this.annoncements;
        }
      },
      error => {
        console.error('Error fetching planned events:', error);
      }
    );
  }
  
}
