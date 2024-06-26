import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VehicleService } from 'src/app/services/vehicle.service';


@Component({
  selector: 'app-choose-brand',
  templateUrl: './choose-brand.component.html',
  styleUrls: ['./choose-brand.component.css']
})
export class ChooseBrandComponent implements OnInit {

  vehicleType!: string | null;
  brands: string[] = [];
  selectedBrand: string = '';
  brandPrefix: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService // Update service import
  ) {}

  ngOnInit(): void {
    this.vehicleType = this.route.snapshot.paramMap.get('vehicleType');
  }

  onBrandPrefixChange(): void {
    if (this.vehicleType) {
      this.vehicleService.getBrands(this.vehicleType, this.brandPrefix).subscribe(data => {
        this.brands = [...new Set(data.map(vehicle => vehicle.brand))];
      });
    } else {
      console.error('Vehicle type is not specified');
    }
  }

  onSelectBrand(): void {
    if (this.selectedBrand) {
      this.router.navigate(['/choose-model', { vehicleType: this.vehicleType, brand: this.selectedBrand }]);
    } else {
      console.error('Brand is not selected');
    }
  }

}