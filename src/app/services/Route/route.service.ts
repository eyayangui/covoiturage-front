import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AssemblyPoint, RouteP } from 'src/app/Models/RouteP';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private apiServerUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient){}

  public addRoute(route: RouteP): Observable<any> {
    return this.http.post<any>(`${this.apiServerUrl}/route/add-route`, route);
  }
  public getRoutes(): Observable<RouteP[]> { 
    return this.http.get<RouteP[]>(`${this.apiServerUrl}/route/get-routes`);
  }

  public routeById ( routeID : any): Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/route/route-id/${routeID}` )
  }
  public pointByid ( assemblyPointsID : any): Observable<any>{
    return this.http.get<any>(`${this.apiServerUrl}/AssemblyPoints/assembly-points/${assemblyPointsID}` )
  }
 

  public updateRoute(route: RouteP) : Observable<RouteP> {
    return this.http.put<RouteP>(`${this.apiServerUrl}/route/update-route/${route.routeID}`, route);
  }
  public updatePoints(route: AssemblyPoint) : Observable<RouteP> {
    return this.http.put<RouteP>(`${this.apiServerUrl}/AssemblyPoints/update-points/${route.assemblyPointsID}`, route);
  }
  
  
}
