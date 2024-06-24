import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from 'src/app/Models/Event'; 

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}

  public AddEvent(event : Event): Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/event/add-event`,event);
  }
  public getEvent(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiServerUrl}/event/all-events`);
  }

public deleteEvent(eventID : any){
  return  this.http.delete(`${this.apiServerUrl}/event/delete-event/${eventID}`)
}

public updateEvent(event: Event) : Observable<Event> {
  return this.http.put<Event>(`${this.apiServerUrl}/event/update-event/${event.eventID}`, event);
}


public eventPlanned () : Observable<Event[]>{
  return this.http.get<Event[]>(`${this.apiServerUrl}/event/event-planned`);
}
public eventById ( eventID : any): Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/event/${eventID}` )
}


}
