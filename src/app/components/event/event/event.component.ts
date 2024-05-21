import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/event.service';
import { Event } from 'src/app/Models/Event';
import { Observable, Subject } from "rxjs";
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  events: Event[] = [];
  noEventsFound: boolean = false;
  isupdated = false;
  updateForm: FormGroup;
  selectedEvent: Event | null = null; 


  constructor(private eventService: EventService, private router: Router,private fb: FormBuilder) {  this.updateForm = this.fb.group({
    eventName: [''],
    eventDate: [''],
    datePublication: [''],
    location: [''],
    heure:['']

  });
}

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
  openUpdateModal(event: any): void {
    this.selectedEvent = event;
    this.updateForm.patchValue({
      eventName: event.eventName,
      eventDate: event.eventDate,
      location: event.location,
      datePublication: event.datePublication,
      heure : event.heure
      
    }); 
  }
  onSubmit(): void {
    if (this.updateForm.valid && this.selectedEvent) {
      const updateevent: Event = {
        ...this.selectedEvent,
        ...this.updateForm.value
      };

      this.eventService.updateEvent(updateevent).subscribe(
        () => {
          Swal.fire('Success', 'Announcement updated successfully!', 'success');
          this.getEvents();
        },
        error => {
          console.error('Error updating announcement:', error);
          Swal.fire('Error', 'Failed to update announcement!', 'error');
        }
      );
    }
  }
}
