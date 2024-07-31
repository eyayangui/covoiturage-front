import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BookingDTO } from '../Models/BookingDTO';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = environment.apiBaseUrl;
  private apiServerUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  /* startBookingProcess(params: { [key: string]: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.apiServerUrl, params, { headers });
  } */

  startBookingProcess(params: { announcementId: string, passengerId?: string, location: string }): Observable<any> {
    return this.http.post(`${this.apiServerUrl}/initial/start-booking-process`, params);
  }

  getBookingsByAnnouncementId(announcementId?: number): Observable<BookingDTO[]> {
    const url = `${this.apiServerUrl}/booking/announcement/${announcementId}`;
    return this.http.get<BookingDTO[]>(url);
  }

  updateBookingStatus(idReservation: number, newStatus: string): Observable<void> {
    const url = `${this.apiServerUrl}/booking/${idReservation}/status`;
    return this.http.put<void>(url, `"${newStatus}"`, { // send the status as a plain string
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError<void>('updateBookingStatus'))
    );
  }

  /* deleteBooking(announcementId: number): Observable<any> {
    const url = `${this.apiServerUrl}/cancelling/bookings/${announcementId}`;
    return this.http.delete(url, { responseType: 'text' }).pipe(
      catchError(this.handleError<any>('deleteBooking'))
    );
  } */

   deleteBooking(announcementId: number) {
    return  this.http.delete(`${this.apiServerUrl}/cancelling/bookings/${announcementId}`)
  
  } 
  

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console
      return of(result as T);
    };
  }

  getBookingByAnnouncementAndDriver(announcementId: number, userId?: number): Observable<BookingDTO | null> {
    return this.http.get<BookingDTO | null>(`${this.apiServerUrl}/booking/announcement/${announcementId}/passager/${userId}`);
  }

  cancelBooking(bookingId: number, cause: string): Observable<any> {
    const params = new HttpParams().set('cause', cause);
    return this.http.post(`${this.apiServerUrl}/cancelling/cancel/${bookingId}`, null, { params });
  }
  
}
