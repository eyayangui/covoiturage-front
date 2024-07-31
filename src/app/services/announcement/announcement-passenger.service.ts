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

  public addAnnouncementPassenger(annonce: AnnoncePassenger): Observable<AnnoncePassenger> {
    return this.http.post<AnnoncePassenger>(`${this.apiServerUrl}/announcement-passenger/add-announcement-passenger`, annonce);
  }

  public getAnnouncementPassenger(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement-passenger/announcement-passenger`);
  }
  public updateAnnouncementPassenger(annonce: AnnoncePassenger) : Observable<AnnoncePassenger> {
    return this.http.put<AnnoncePassenger>(`${this.apiServerUrl}/announcement-passenger/update-announcement-passenger/${annonce.annonceID}`, annonce);
  }
  

 public deleteAnnouncementDriver(annonceID : any){
    return  this.http.delete(`${this.apiServerUrl}/announcement/delete-announcement/${annonceID}`)
  }

  public availableAnnouncementPassenger(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}:announcement-passenger/available-announcement`);
  }

  public announcementPassengerDate(): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement-passenger/announcement-passenger-date`);
  }

  getAnnouncementPassengerByRayon(rayon: string): Observable<AnnoncePassenger> {
    return this.http.get<AnnoncePassenger>(`${this.apiServerUrl}/announcement-passenger/announcement-passenger-by-rayon/${rayon}`);
    
  }
  findAnnoncesPassagerByuserId(userId: any): Observable<AnnoncePassenger[]> {
    return this.http.get<AnnoncePassenger[]>(`${this.apiServerUrl}/announcement-passenger/announcement-passener-by-user/${userId}`);
  }
}
