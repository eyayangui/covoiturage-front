import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    const role = localStorage.getItem('role');
    if (role === 'ADMINISTRATOR') {
      return true;
    } else {
      this.router.navigate(['/unauthorized']); // Redirect to an unauthorized page or home
      return false;
    }
  }
}
