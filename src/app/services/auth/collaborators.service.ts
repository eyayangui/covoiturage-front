import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
