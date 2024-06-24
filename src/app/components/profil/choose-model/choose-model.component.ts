import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { VehicleService } from 'src/app/services/vehicle.service';

@Component({
  selector: 'app-choose-model',
  templateUrl: './choose-model.component.html',
  styleUrls: ['./choose-model.component.css']
})
export class ChooseModelComponent implements OnInit {

  vehicleType?: string |null;
  brand!: string | null;
  models!: string[];
  selectedModel!: string;
  modelPrefix!: string;
  collaborator?: CollaboratorDTO;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  ngOnInit() {
    this.vehicleType = this.route.snapshot.paramMap.get('vehicleType');
    this.brand = this.route.snapshot.paramMap.get('brand');
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
  }


  onModelPrefixChange() {
    if (this.vehicleType && this.brand) {
      this.vehicleService.getModels(this.vehicleType, this.brand, this.modelPrefix).subscribe(data => {
        this.models = data.map(vehicle => vehicle.model); 
      });
    } else {
      console.error('Vehicle type or brand is not specified');
    }
  }

  onAssignVehicle() {
    if (this.vehicleType && this.brand && this.selectedModel && this.collaborator && this.collaborator.idCollaborator) {
      this.vehicleService.assignVehicle(this.collaborator.idCollaborator, this.vehicleType, this.brand, this.selectedModel).subscribe(response => {
        console.log('Vehicle assigned successfully:', response);
        this.router.navigate(['/profil']);
      }, error => {
        console.error('Error assigning vehicle:', error);
      });
    } else {
      console.error('Vehicle type, brand, collaborator, or selected model is not specified');
    }
  }
  
}
