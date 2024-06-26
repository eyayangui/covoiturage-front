import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Claim } from 'src/app/Models/Claim';
@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}
  public AddClaim(claim : Claim): Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/claim/add-claim/${claim.annonceID}`, claim);
  }
  public getClaim(): Observable<Claim[]> {
    return this.http.get<Claim[]>(`${this.apiServerUrl}/claim/all-claims`);
  }

}

