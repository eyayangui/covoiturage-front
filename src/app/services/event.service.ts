import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event as EventModel } from 'src/app/Modal/Modals/event'; 

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}

  public AddEvent(event : Event): Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/add-event`,event);
  }
  public getEvent(): Observable<EventModel[]> {
    return this.http.get<EventModel[]>(`${this.apiServerUrl}/event/all-events`);
  }
public deleteEvent(eventID : any){
  return  this.http.delete(`${this.apiServerUrl}/delete-event/${eventID}`)
}
public updateEvent(event : Event, eventID : any): Observable<any>{
  return this.http.put<any>(`${this.apiServerUrl}/update-event/${eventID}`,event )
}

public eventPlanned () : Observable<EventModel[]>{
  return this.http.get<EventModel[]>(`${this.apiServerUrl}/event/event-planned`);
}
public eventById ( eventID : any): Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/event/${eventID}` )
}


}
