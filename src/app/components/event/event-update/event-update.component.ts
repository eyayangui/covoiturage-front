import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/Models/Event';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {
  event : Event [] =[];
  eventId: any;

  constructor(private eventService: EventService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id');
    this.getEventDetails();
  }

  getEventDetails(): void {
    this.eventService.eventById(this.eventId).subscribe(event => {
      event.eventDate = new Date(event.eventDate);
      this.event = event;
    });
  }

  /* updateEvent(event: Event): Observable<any> {
    return this.eventService.updateEvent(event, this.eventId);
  }
  

  onSubmit(): void {
    this.updateEvent(this.event).subscribe(() => {
      this.location.back();
    });
  } */
}