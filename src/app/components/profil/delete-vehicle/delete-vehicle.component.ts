import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { Vehicle } from 'src/app/Models/Vehicle';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-delete-vehicle',
  templateUrl: './delete-vehicle.component.html',
  styleUrls: ['./delete-vehicle.component.css']
})
export class DeleteVehicleComponent implements OnInit{

  collaborator?: CollaboratorDTO;
  @Input() vehicle?: Vehicle;
  @Input() vehicleId?: number;
  @Output() vehicleDeleted = new EventEmitter<number>();

  constructor(private vehicleService: VehicleService) { }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
  }

  deleteVehicle() {
    if (this.vehicleId && this.collaborator?.idCollaborator) {
      this.vehicleService.deleteCollaboratorVehicle(this.vehicleId, this.collaborator.idCollaborator)
        .subscribe(() => {
          this.vehicleDeleted.emit(this.vehicleId);
        }, error => {
          console.error('Error deleting vehicle', error);
        });
    } else {
      console.error('Vehicle ID or Collaborator ID is missing');
    }
  }

}
