import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KPIService {
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getCountAnnoncesConducteurByYear(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/announcement-driver/conducteur/countByYear`);
  }

  getCountAnnoncesConducteurByMonth(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/announcement-driver/conducteur/countByMonth`);
  }

  
  getCountAnnoncesConducteurByRayon(rayon: string): Observable<number> {
    return this.http.get<number>(`${this.apiServerUrl}/announcement-driver/conducteur/count?rayon=${rayon}`);
  }

  getcountAnnoncesConducteurByPrice(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiServerUrl}/announcement-driver/conducteur/countByPrice`);
  }


//passager


getCountAnnoncesPassengerByYear(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiServerUrl}/announcement-passenger/Passenger/countByYear`);
}

getCountAnnoncesPassengerByMonth(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiServerUrl}/announcement-passenger/Passenger/countByMonth`);
}
getCountAnnoncesPassenerByRayon(rayon: string): Observable<number> {
  return this.http.get<number>(`${this.apiServerUrl}/announcement-passenger/Passenger/count?rayon=${rayon}`);
}






}
