import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';

@Component({
  selector: 'app-collaborator-image',
  templateUrl: './collaborator-image.component.html',
  styleUrls: ['./collaborator-image.component.css']
})
export class CollaboratorImageComponent implements OnInit{

  @Input() collaboratorId?: number;
  imageUrl!: SafeUrl;

  constructor(
    private collaboratorService: CollaboratorsService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.collaboratorId) {
      this.collaboratorService.getCollaboratorImage(this.collaboratorId).subscribe(
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

}
