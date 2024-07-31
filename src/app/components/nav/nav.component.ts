import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { AnnouncementDriverService } from 'src/app/services/announcement/announcement-driver.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  collaborator?: CollaboratorDTO;
  searchTerm: string = '';
  isAdmin: boolean = false;
  imageUrl!: SafeUrl;
  @Input() collaboratorId?: number;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private sanitizer: DomSanitizer, private collaboratorService: CollaboratorsService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.authService.userRoleUpdated.subscribe(role => {
      this.isAdmin = (role === 'ADMINISTRATOR');
    });
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
    if (this.collaborator?.idCollaborator) {
      this.collaboratorService.getCollaboratorImage(this.collaborator?.idCollaborator).subscribe(
        response => {
          let objectURL = URL.createObjectURL(response);
          this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        },
        error => {
          console.error('Error fetching image', error);
        }
      );
    }
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