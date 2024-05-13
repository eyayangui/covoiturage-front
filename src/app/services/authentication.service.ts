import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private baseUrl = 'http://localhost:8080/api/v1/auth'

  constructor(
    private http: HttpClient
  ) { }


  /* login(authRequest: AuthenticationRequest) {
    return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest);
  } */

}
