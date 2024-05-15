import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/Models/Event';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.css']
})
export class EventUpdateComponent implements OnInit {
  events: Event[] = [];
  
  noEventsFound: boolean = false;
  isupdated = false;
  defaultEvent: Event = {
    eventID: 0,
    eventName: '',
    eventDate: new Date(),
    datePublication: '',
    location: ''
  };


  constructor(private eventService: EventService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEvents();
  }

  getEvents(): void {
    this.eventService.getEvent().subscribe(
      events => {
        this.events = events;
      },
      error => {
        console.error('Error fetching events:', error);
      }
    );
  }
  updateEvent(eventID: number): void {
    this.eventService.eventById(eventID).subscribe(
      data => {
        if (data) { 
          this.defaultEvent = data;
        }
      },
      error => {
        console.error('Error fetching event details:', error);
      }
    );
  }

  eventUpdateform = new FormGroup({
    eventID: new FormControl(),
    eventName: new FormControl(),
    eventDate: new FormControl(),
    datePublication: new FormControl(),
    location: new FormControl()
  });

  updateEventForm(): void {
    if (this.defaultEvent) { 
      this.defaultEvent.eventID = this.eventID?.value;
      this.defaultEvent.eventName = this.eventName?.value;
      this.defaultEvent.eventDate = this.eventDate?.value;
      this.defaultEvent.datePublication = this.datePublication?.value;
      this.defaultEvent.location = this.location?.value;
  
      this.eventService.updateEvent(this.defaultEvent.eventID, this.defaultEvent).subscribe(
        () => {
          this.isupdated = true;
          this.getEvents(); 
        },
        error => {
          console.error('Error updating event:', error);
        }
      );
    }
  }

  get eventName() {
    return this.eventUpdateform.get('eventName');
  }

  get eventDate() {
    return this.eventUpdateform.get('eventDate');
  }

  get datePublication() {
    return this.eventUpdateform.get('datePublication');
  }

  get location() {
    return this.eventUpdateform.get('location');
  }

  get eventID() {
    return this.eventUpdateform.get('eventID');
  }

  changeisUpdate() {
    this.isupdated = false;
  }
}