import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { Annonce } from 'src/app/Models/AnnonceDto';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementDriverService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient){}

  public addAnnouncementDriver(annonce: AnnouncementDriver): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/announcement-driver/add-announcement-driver`, annonce);
  }
  public updateAnnouncementDriver(annonce: AnnouncementDriver) : Observable<AnnouncementDriver> {
    return this.http.put<AnnouncementDriver>(`${this.apiServerUrl}/announcement-driver/update-announcement-driver/${annonce.annonceID}`, annonce);
  }
 

 public getAnnouncementDriver(): Observable<AnnouncementDriver[]> {
    return this.http.get<AnnouncementDriver[]>(`${this.apiServerUrl}/announcement-driver/announcements-driver`);
  }
  
  getAnnouncementDriverById(annonceID: number): Observable<AnnouncementDriver> {
    return this.http.get<AnnouncementDriver>(`${this.apiServerUrl}/announcement-driver/announcementDriver/${annonceID}`);
  }

  public deleteAnnouncementDriver(annonceID : any){
    return  this.http.delete(`${this.apiServerUrl}/announcement/delete-announcement/${annonceID}`)
  }

  public availableAnnouncementDriver(): Observable<AnnouncementDriver[]> {
    return this.http.get<AnnouncementDriver[]>(`${this.apiServerUrl}/announcement-passenger/available-announcement`);
  }

  public announcementDriverDate(): Observable<AnnouncementDriver[]> {
    return this.http.get<AnnouncementDriver[]>(`${this.apiServerUrl}/announcement-driver/announcement-driver-date`);
  }
  getAnnouncementDriverByRayon(rayon: string): Observable<AnnouncementDriver> {
    return this.http.get<AnnouncementDriver>(`${this.apiServerUrl}/announcement-driver/announcement-driver-by-rayon/${rayon}`);
    
  }

  findAnnoncesByuserId(userId: any): Observable<AnnouncementDriver[]> {
    return this.http.get<AnnouncementDriver[]>(`${this.apiServerUrl}/announcement-driver/announcement-by-user/${userId}`);
  }
}
