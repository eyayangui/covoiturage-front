import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { EventService } from 'src/app/services/event.service';
import { Event as MyEvent } from 'src/app/Models/Event'; // Utilisez un alias pour distinguer le modèle de celui de @angular/core
import { Observable, Subject } from "rxjs";
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  events: MyEvent[] = [];
  event: MyEvent = {} as MyEvent;

  constructor(private eventservice: EventService,
              private router: Router) {}

  ngOnInit(): void {}

 
}
