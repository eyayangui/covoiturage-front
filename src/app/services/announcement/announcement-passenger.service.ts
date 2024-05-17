import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from 'src/app/Models/AnnonceDto';
import { AnnoncePassenger } from 'src/app/Models/AnnoncePassenger';
@Injectable({
  providedIn: 'root'
})
export class AnnouncementPassengerService {

  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient){}

  public addAnnouncementPassenger(annonce: AnnoncePassenger): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/announcement-passenger/add-announcement-passenger`, annonce);
  }

  public getAnnouncementPassenger(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement-passenger/announcement-passenger`);
  }

 public deleteAnnouncementDriver(annonceID : any){
    return  this.http.delete(`http://localhost:8090/announcement/delete-announcement/${annonceID}`)
  }

  public availableAnnouncementPassenger(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement-passenger/available-announcement`);
  }

  public announcementPassengerDate(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement-passenger/announcement-passenger-date`);
  }
}
