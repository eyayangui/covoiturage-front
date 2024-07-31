  import { HttpClient } from '@angular/common/http';
  import { Injectable } from '@angular/core';
  import { Observable, Subject, tap } from 'rxjs';
  import { AuthenticationRequest } from 'src/app/Models/AuthenticationRequest';
  import { AuthenticationResponse } from 'src/app/Models/AuthenticationResponse';
  import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { environment } from 'src/environments/environment';
import { CollaboratorsService } from './collaborators.service';

  @Injectable({
    providedIn: 'root'
  })
  export class AuthenticationService {
    userDetails: CollaboratorDTO | undefined;
    userDetailsUpdated: Subject<void> = new Subject<void>();
    userRoleUpdated: Subject<string | null> = new Subject<string | null>();
    private userUpdateSource = new Subject<void>();
    userUpdated = this.userUpdateSource.asObservable();
    collaborator?: CollaboratorDTO ;
    error: string | null = null;
    private baseUrl = environment.apiBaseUrl;
   
    constructor(private http: HttpClient,
      private collaboratorService:CollaboratorsService
    ) { }
   
    login(authRequest: AuthenticationRequest) {
      return this.http.post<AuthenticationResponse>(`${this.baseUrl}/authenticate`, authRequest).pipe(
        tap(response => {
          if (response.accessToken && response.idCollaborator && response.role) {
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('userId', response.idCollaborator.toString());
            localStorage.setItem('role', response.role as string);
            this.getCollaborator(response.idCollaborator);
           
            this.userRoleUpdated.next(response.role as string);
            this.userUpdateSource.next(); // Notify of user update
          } else {
            console.error('Invalid user details received:', response);
          }
        })
      );
    }

    getCollaborator(id?: number) {
      this.collaboratorService.getCollaboratorById(id).subscribe(
        (data: CollaboratorDTO) => {
          this.collaborator = data;
          console.log("Collaborator: " + JSON.stringify(this.collaborator));
          localStorage.setItem('user', JSON.stringify(this.collaborator));
          this.updateUserDetails();
        },
        (error) => {
          this.error = error;
        }
      );
    }
   
    updateUserDetails() {
      const userDetailsJson = localStorage.getItem('user');
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
      return !!localStorage.getItem('accessToken');
    }
   
    getUserDetails(): any {
      const userDetails = localStorage.getItem('user');
      return userDetails ? JSON.parse(userDetails) : null;
    }
   
    isAdmin(): boolean {
      const userDetails = localStorage.getItem("role");
      return userDetails === 'ADMINISTRATOR';
    }
   
    updateUserInfo() {
      this.userUpdateSource.next();
    }
  }