import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event} from 'src/app/Models/Event'; 
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events : Event [] =[];
  noEventsFound: boolean = false;
  
 
  constructor(private eventService : EventService, private router: Router) {}

  ngOnInit(): void {
    this.eventService.getEvent().subscribe(
      events => {
        this.events = events;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }
 showPlannedEvents(): void {
  this.eventService.eventPlanned().subscribe(
    events => {
      if (events.length === 0) {
        this.events = []; // Réinitialiser les événements pour vider la liste
        this.noEventsFound = true; // Définir la variable pour indiquer qu'aucun événement n'a été trouvé
      } else {
        this.events = events;
        this.noEventsFound = false; // Aucun événement trouvé
      }
    },
    error => {
      console.error('Error fetching planned events:', error);
    }
  );
}
deleteEvent(eventID: any): void {
  this.eventService.deleteEvent(eventID).subscribe(
    () => {
      window.location.reload();
    },
    error => {
      console.error('Error deleting event:', error);
    }
  );
}

 
}
