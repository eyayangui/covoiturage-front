import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService {

  private baseUrl = 'http://localhost:8888/collaborators'

  constructor(private http: HttpClient) { }

  getCollaboratorById(id?: number): Observable<CollaboratorDTO> {
    return this.http.get<CollaboratorDTO>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  getCollaboratorImage(id: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${id}/display-image`, { responseType: 'blob' });
  }

  /* updateCollaboratorAttribute(id?: number, attributeName?: string, attributeValue?: string): Observable<CollaboratorDTO> {
    const url = `${this.baseUrl}/attribute/${id}`;
    return this.http.patch<CollaboratorDTO>(url, { attributeName, attributeValue }, {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    });
  } */

  updateCollaboratorAttribute(id?: number, attributeName?: string, attributeValue?: string): Observable<CollaboratorDTO> {
    const url = `${this.baseUrl}/attribute/${id}`;
    const body = {
      attributeName: attributeName,
      attributeValue: attributeValue
    };
    return this.http.patch<CollaboratorDTO>(url, body);
  } 
  uploadCollaboratorImage(id: number, file: File): Observable<CollaboratorDTO> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.put<CollaboratorDTO>(`${this.baseUrl}/${id}/image`, formData);
  }
}
