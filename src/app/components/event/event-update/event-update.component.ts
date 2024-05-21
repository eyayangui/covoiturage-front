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
  


  constructor(private eventService: EventService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    
  }

  
}