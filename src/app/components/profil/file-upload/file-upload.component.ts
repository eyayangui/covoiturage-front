import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{

  selectedFile!: File;
  collaboratorId?: number;
  uploadResponse: any;
  errorMessage: string | null = null;
  collaborator?: CollaboratorDTO;

  constructor(private http: HttpClient,
    private router: Router
  ) {}

  onFileSelected(event: any) {
    if (event && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }


  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
    this.collaboratorId = this.collaborator?.idCollaborator;
  }

  onUpload() {
    if (!this.selectedFile || !this.collaboratorId) {
      console.error('File or collaborator ID is missing');
      return;
    }
    const uploadData = new FormData();
    uploadData.append('file', this.selectedFile, this.selectedFile.name);
  
    this.http.put(`http://localhost:8888/collaborators/${this.collaboratorId}/image`, uploadData)
      .subscribe(
        response => {
          this.router.navigate(['/profil']);

          this.uploadResponse = response;
          this.errorMessage = null;
        },
        (error: HttpErrorResponse) => {
          console.error('Upload error:', error);
          this.errorMessage = this.getErrorMessage(error);
          this.uploadResponse = null;
        }
      );
  }
  
  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      return `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.error instanceof ProgressEvent) {
        // This happens when there's no JSON response (like a CORS issue)
        return `Server-side error: ${error.message}`;
      } else {
        try {
          const parsedError = JSON.parse(error.error);
          return `Server-side error: ${parsedError.message || error.message}`;
        } catch (e) {
          return `Server-side error: ${error.message}`;
        }
      }
    }
  }
  


}
