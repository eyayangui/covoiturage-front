import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-choose-vehicle-type',
  templateUrl: './choose-vehicle-type.component.html',
  styleUrls: ['./choose-vehicle-type.component.css']
})
export class ChooseVehicleTypeComponent {

  vehicleTypes = ['CAR', 'MOTOBIKE', 'SCOOTER'];
  selectedType!: string;

  constructor(private router: Router) {}

  onSelectType() {
    this.router.navigate(['/choose-brand', { vehicleType: this.selectedType }]);
  }

}
