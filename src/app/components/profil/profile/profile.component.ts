import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { CollaboratorDTO } from 'src/app/Models/CollaboratorDTO';
import { Vehicle } from 'src/app/Models/Vehicle';
import { CollaboratorsService } from 'src/app/services/auth/collaborators.service';
import { VehicleService } from 'src/app/services/vehicle.service';
import { DeleteVehicleComponent } from '../delete-vehicle/delete-vehicle.component';
import { NgForm } from '@angular/forms';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{

  collaborator?: CollaboratorDTO;
  vehicles: Vehicle[] = [];
  selectedVehicleId?: number;
  attributeValue?: string;
  @ViewChild('deleteModal') deleteVehicleComponent?: DeleteVehicleComponent;
  

  constructor(private collaboratorService: CollaboratorsService, 
    private vehicleService : VehicleService,
    private modalService: ModalService
  ){

  }

  ngOnInit(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.collaborator = JSON.parse(storedUser); 
    }
  
    this.getVehicles();

  }

  onCollaboratorUpdated(updatedCollaborator: CollaboratorDTO) {
    this.collaborator = updatedCollaborator;
  }

  openModal() {
    this.modalService.openModal();
  }

  updateCollaboratorData(collaborator: CollaboratorDTO) {
    this.collaborator = collaborator;
  }
 
  getVehicles(): void {
    this.vehicleService.getVehiclesByCollaboratorId(this.collaborator?.idCollaborator)
      .subscribe(vehicles => {
        this.vehicles = vehicles;
        console.log(this.vehicles);
      }, error => {
        console.error('Error fetching vehicles', error);
      });
  }

  openDeleteModal(vehicleId?: number) {
    if(vehicleId){
    console.log(`Opening delete modal for vehicle ID: ${vehicleId}`); 
    this.selectedVehicleId = vehicleId;
    }
  }

  setVehicleId(vehicleId?: number) {
    if (vehicleId) {
      console.log(`Setting vehicle ID: ${vehicleId}`);
      this.selectedVehicleId = vehicleId;
      if (this.deleteVehicleComponent) {
        this.deleteVehicleComponent.vehicleId = vehicleId;
      }
    }
  }

 
 
  /* onInputChange(event: any) {
    const inputValue = event.target.value;
    const isValid = /^\d{8}$/.test(inputValue); // Regex to check for exactly 8 digits
    
    if (!isValid) {
      // Optionally, you can reset the input value or provide feedback to the user
      event.target.value = ''; // Reset the value or handle accordingly
    }
  }

  validateNumberLength(control:any) {
    const value = control.value;
    const valid = /^\d{8}$/.test(value); // Regex to check for exactly 8 digits

    return valid ? null : { invalidNumber: true };
  } */

}
