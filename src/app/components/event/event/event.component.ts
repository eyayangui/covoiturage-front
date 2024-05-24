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
  addForm: FormGroup;



  constructor(private eventService: EventService, private router: Router,private fb: FormBuilder) { 
    
      this.addForm = this.fb.group({
        eventName: ['', Validators.required],
        eventDate: ['', Validators.required],
        datePublication:['', Validators.required],
        location: ['', Validators.required],
        heure:['', Validators.required],
      }); 
      this.updateForm = this.fb.group({
    eventName: ['', Validators.required],
    eventDate: ['', Validators.required],
    datePublication: ['', Validators.required],
    location:['', Validators.required],
    heure:['', Validators.required],

  });
}

  ngOnInit(): void {
    this.showPlannedEvents();
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
  getRemainingDays(eventDate: Date): number {
    const currentDate = new Date();
    const covoiturageDate = new Date(eventDate);
    const differenceInTime = covoiturageDate.getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays;
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
  onAddSubmit(): void {
    
    const newevent: Event = this.addForm.value;
    this.eventService.AddEvent(newevent).subscribe(
      (response: Event) => {
        Swal.fire('Success', 'event added successfully!', 'success');
        
        this.showPlannedEvents();
        this.addForm.reset();
      },
    
      (error: any) => {
        console.error('Error adding event:', error);
        Swal.fire('Error', 'Failed to add event!', 'error');
      }
    );
  
}
}
