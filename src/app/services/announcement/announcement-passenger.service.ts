import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from 'src/app/Models/Annonce';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementPassengerService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}
  public  AddAnnouncementPassenger(annonce : AnnoncePassenger): Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/announcement//add-announcement-passenger`,annonce);
  }
  public getAnnouncementPassenger(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`http://localhost:8095/announcement/announcement-passenger`);
  }
public deleteAnnouncementPassenger(AnnonceID : any){
  return  this.http.delete(`http://localhost:8090/announcement/delete-announcement/${AnnonceID}`)
}
public availableannouncementPassenger () : Observable<AnnoncePassenger[]>{
  return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement/available-announcement`);
}
public announcementPassengerDate () : Observable<AnnoncePassenger[]>{
  return this.http.get<AnnoncePassenger[]>(`http://localhost:8090/announcement-passenger/announcement-passenger-date"`);
}


}
