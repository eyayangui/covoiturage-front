import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vehicle } from '../Models/Vehicle';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  private apiUrl = 'http://localhost:8888/vehicles';

  constructor(private http: HttpClient) { }

  getBrands(vehicleType: string, brandPrefix: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/brands`, { params: { vehicleType, brandPrefix } });
  }

  getModels(vehicleType: string, brand: string, modelPrefix: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/models`, { params: { vehicleType, brand, modelPrefix } });
  }

  assignVehicle(collaboratorId: number, vehicleType: string, brand: string, model: string): Observable<any> {
    let params = new HttpParams()
      .set('collaboratorId', collaboratorId.toString())
      .set('vehicleType', vehicleType)
      .set('brand', brand)
      .set('model', model);
    return this.http.post<any>(`${this.apiUrl}/assign`, {}, { params });
  }
  
  getVehiclesByCollaboratorId(collaboratorId?: number): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/byCollaborator/${collaboratorId}`);
  }

  deleteCollaboratorVehicle(vehicleId?: number, collaboratorId?: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${vehicleId}/collaborator-vehicles/${collaboratorId}`);
  }

}
