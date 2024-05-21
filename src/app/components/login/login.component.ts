import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/Models/AuthenticationRequest';
import { AuthenticationResponse } from 'src/app/Models/AuthenticationResponse';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { timer } from 'rxjs';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {};
  authResponse: AuthenticationResponse = {};
  collaborator: CollaboratorDTO | null = null;
  error: string | null = null;

  constructor(
    private authService: AuthenticationService, private collaboratorService: CollaboratorsService,
    private router: Router
  ) {
  }

  isLoggedIn: boolean = false;
  loginError: boolean = false;


  authenticate() {
    this.authService.login(this.authRequest).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.accessToken as string);
        // Store user's role in local storage
        localStorage.setItem('role', response.role as string);
        var col = this.getCollaborator(response.idCollaborator);
        console.log("id :" + col);
        this.isLoggedIn = true; // Set to true after successful login
        const userRole = response.role as string;
        this.router.navigate(['event']);
        /* if (userRole === 'ADMINISTRATOR') {
          this.router.navigate(['listpatient']);
        } */
      },
      error: (error) => {
        this.loginError = true;
        timer(5000).subscribe(() => {
          this.loginError = false; 
        });
      }
    });
  }

  getCollaborator(id?: number) {
    this.collaboratorService.getCollaboratorById(id).subscribe(
      (data: CollaboratorDTO) => {
        this.collaborator = data;
      },
      (error) => {
        this.error = error;
      }
    );
  }


}
