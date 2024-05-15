import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Annonce } from 'src/app/Models/Annonce';

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
    return this.http.get<Annonce[]>(`http://localhost:8095/announcement/announcements`);
  }
public deleteAnnouncement(AnnonceID : any){
  return  this.http.delete(`http://localhost:8090/announcement/delete-announcement/${AnnonceID}`)
}
public availableannouncement () : Observable<Annonce[]>{
  return this.http.get<Annonce[]>(`${this.apiServerUrl}/announcement/available-announcement`);
}
}
