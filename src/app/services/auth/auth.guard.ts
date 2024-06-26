import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('accessToken');
    console.log('accessToken:', token); // Debugging log
    if (token) {
      return true;
    } else {
      console.log('No token found, redirecting to login'); // Debugging log
      this.router.navigate(['/login']);
      return false;
    }
  }

  
}
