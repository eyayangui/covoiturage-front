import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/Models/Event';
import { Observable, Subject } from "rxjs";
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
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
  constructor(private eventService: EventService, private router: Router) { }

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

  showPlannedEvents(): void {
    this.eventService.eventPlanned().subscribe(
      events => {
        if (events.length === 0) {
          this.events = [];
          this.noEventsFound = true;
        } else {
          this.events = events;
          this.noEventsFound = false;
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
        this.router.navigate(['/event']);
      },
      error => {
        console.error('Error deleting event:', error);
      }
    );
  }
  }
