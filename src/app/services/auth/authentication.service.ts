  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, Subject, tap } from 'rxjs';
  import { AuthenticationRequest } from 'src/app/Models/AuthenticationRequest';
  import { AuthenticationResponse } from 'src/app/Models/AuthenticationResponse';
  import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService {
    userDetails: CollaboratorDTO | undefined;
    userDetailsUpdated: Subject<void> = new Subject<void>();

    private baseUrl = 'http://localhost:8888'

    constructor(
      private http: HttpClient, 

    ) { }


  // login(authRequest: AuthenticationRequest) {
    //  return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest);
  // } 

  //}
  login(loginRequest: any): Observable<CollaboratorDTO> {
    return this.http.post<CollaboratorDTO>(`${this.baseUrl}/authenticate`, loginRequest).pipe(
      tap(response => {
        if (response.jwt && response.idCollaborator &&response.firstName &&response.lastName &&response.email &&response.cin &&response.phoneNumber &&response.gender &&response.birthDate &&response.adress &&response.bonus &&response.role) {
          localStorage.setItem('jwt', response.jwt);
          localStorage.setItem('userId',response.idCollaborator.toString());
          localStorage.setItem('userDetails', JSON.stringify({
            idCollaborator: response.idCollaborator ,
            firstName:response.firstName ,
            lastName:response.lastName ,
            email:response.email ,
            cin:response.cin ,
            phoneNumber:response.phoneNumber,
            gender:response.gender,
            birthDate:response.birthDate,
            adress: response.adress,
            bonus:response.bonus ,
            role:response.role
          }));
          this.updateUserDetails();
        } else {
          console.error('Invalid user details received:', response);
        }
      }
    )
    );
  }
  updateUserDetails() {
    const userDetailsJson = localStorage.getItem('userDetails');
    if (userDetailsJson) {
      try {
        this.userDetails = JSON.parse(userDetailsJson);
        this.userDetailsUpdated.next();
      } catch (e) {
        console.error('Error parsing user details:', e);
      }
    } else {
      console.log('No user details found in local storage.');
    }
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt');
  }


  getUserDetails(): any {
    const userDetails = localStorage.getItem('userDetails');
    return userDetails ? JSON.parse(userDetails) : null;
  }

  isAdmin(): boolean {
    const userDetails = this.getUserDetails();
    return userDetails && userDetails.role === 'ADMINISTRATOR';
  }
  }