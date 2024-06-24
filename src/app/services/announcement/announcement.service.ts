import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from 'src/app/Models/AnnonceDto';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}

  public  AddAnnouncement(annonce : Annonce): Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/announcement/add-announcement`,annonce);
  }
  public getAnnouncement(): Observable<Annonce[]> {
    return this.http.get<Annonce[]>(`${this.apiServerUrl}/announcement/announcements`);
  }
  public deleteAnnouncement(annonceID : any){
    return  this.http.delete(`${this.apiServerUrl}/announcement/delete-announcement/${annonceID}`)
  }
public availableannouncement () : Observable<Annonce[]>{
  return this.http.get<Annonce[]>(`${this.apiServerUrl}/announcement/available-announcement`);
}
public updateAnnouncement(annonce: Annonce) : Observable<Annonce> {
  return this.http.put<Annonce>(`${this.apiServerUrl}/announcement/update-announcement/${annonce.annonceID}`, annonce);
}

public findAnnoncesByEventID(eventID: number): Observable<Annonce[]> {
  return this.http.get<Annonce[]>(`${this.apiServerUrl}/announcement/announcement-by-event/${eventID}`);
}
public addAnnouncementWithEventID(annonce: Annonce, eventID: number): Observable<Annonce> {
  return this.http.post<Annonce>(`${this.apiServerUrl}/announcement/add-announcement-with-event/${eventID}`, annonce);
}

}
