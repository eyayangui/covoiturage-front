import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AnnouncementDriver } from 'src/app/Models/AnnouncementDriver';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
  searchTerm: string = ''; // Définir la propriété searchTerm

  constructor(
    private router: Router,
    private announcementDriverService: AnnouncementDriverService
  ) { }

  isLoginRoute(): boolean {
    return !this.router.url.includes('/login');
  }
 /*  onSearch(): void {
    if (this.searchTerm) {
      this.announcementDriverService.getAnnouncementDriverByRayon(this.searchTerm)
        .subscribe((results: AnnouncementDriver) => {
          console.log(results);
          // Faites quelque chose avec les résultats, par exemple, les stocker dans une propriété pour affichage
        });
    }
  } */
 
}
