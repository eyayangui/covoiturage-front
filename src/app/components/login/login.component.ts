import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/app/Models/AuthenticationRequest';
import { AuthenticationResponse } from 'src/app/Models/AuthenticationResponse';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { timer } from 'rxjs';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'src/app/services/auth/local-storage.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  authRequest: AuthenticationRequest = {};
  authResponse: AuthenticationResponse = {};
  collaborator?: CollaboratorDTO ;
  error: string | null = null;

  constructor(
    private authService: AuthenticationService, 
    private collaboratorService: CollaboratorsService,
    private localStorage: LocalStorageService,
    private router: Router
  ) {
  }


  isLoggedIn: boolean = false;
  loginError: boolean = false;


  authenticate() {
    this.authService.login(this.authRequest).subscribe({
      next: (response) => {
        this.localStorage.setItem('accessToken', response.accessToken as string);
        console.log('Token stored:' ,response);
        
        this.getCollaborator(response.idCollaborator);
        const storedCollaborator = this.localStorage.getItem('user');
        console.log("storedCollaborator : "+ storedCollaborator)
        this.isLoggedIn = true; // Set to true after successful login
        this.router.navigateByUrl('/annoncement-driver');
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
        console.log("Collaborator: " + JSON.stringify(this.collaborator));
        localStorage.setItem('user', JSON.stringify(this.collaborator));
        const storedCollaborator = this.localStorage.getItem('user');
        console.log("storedCollaborator : "+ storedCollaborator)
      },
      (error) => {
        this.error = error;
      }
    );
  }



}

