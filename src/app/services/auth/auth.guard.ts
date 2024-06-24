import { inject } from '@angular/core';

/* 
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);


 if (!localStorage.getItem('token')) {
   router.navigate(['login']);

   return false;
 }
 return true;

};
 */
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('jwt');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
