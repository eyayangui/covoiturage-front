import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  searchTerm: string = '';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private announcementDriverService: AnnouncementDriverService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.authService.userRoleUpdated.subscribe(role => {
      this.isAdmin = (role === 'ADMINISTRATOR');
    });
  }

  isActive(url: string): boolean {
    return this.router.url === url;
  }

  isLoginRoute(): boolean {
    return !this.router.url.includes('/login');
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
    this.authService.userRoleUpdated.next(null);
  }
}