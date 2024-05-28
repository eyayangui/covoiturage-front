import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RouteP } from 'src/app/Models/RouteP';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}

  public AddRoute(route : RouteP): Observable<any>{
    return this.http.post<any>(`${this.apiServerUrl}/route/add-route`,route);
  }
  public getRoutes(): Observable<RouteP[]> { 
    return this.http.get<RouteP[]>(`${this.apiServerUrl}/route/get-routes`);
  }

  public routeById ( routeID : any): Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/route/route-id/${routeID}` )
  }
}
