import { Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { KPIService } from 'src/app/services/kpi.service';

@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.css']
})
export class KPIComponent implements OnInit {
  annonceCountByYear: any[] = [];
  annonceCountByPrice: any[] = [];
  annonceCountByMonth: any[] = [];
  annonceCountByprice: any[] = [];
  pieChartData: { label: string, value: number }[] = [];
  annonceCountByRayon: { rayon: string, count: number }[] = [];
  isDriverChart: boolean = true; // Flag to determine if current chart is for drivers
  currentChart: string = 'year'; // Variable to control the current chart
  isDriverChartSelected: boolean = true; // Initialisation par défaut
  isPassengerChartSelected: boolean = false;
  public barChartOptions: ChartOptions = {
    responsive: true,
  };

  public pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    }
  };

  public yearChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public monthChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  public pieChartDataSet: ChartData<'pie'> = { labels: [], datasets: [] };
  public priceChartData: ChartData<'bar'> = { labels: [], datasets: [] };


  constructor(private kpiService: KPIService) {}

  ngOnInit(): void {
    this.loadDriverCharts(); // Load driver charts by default
  }

  loadDriverCharts(): void {
    this.isDriverChart = true;
    this.loadAnnonceCountByYear();
    this.loadAnnonceCountByMonth();
    this.loadAnnonceCountByRayon();
    this.loadAnnonceCountByPrice();
  }

  loadPassengerCharts(): void {
    this.isDriverChart = false;
    this.loadAnnonceCountPassengerByYear();
    this.loadAnnonceCountPassengerByMonth();
    this.loadAnnonceCountPassengerByRayon(); 
    
  }
  loadAnnonceCountByPrice(): void{
    this.kpiService.getcountAnnoncesConducteurByPrice().subscribe(data => {
    this.annonceCountByPrice = data;
      this.updatePriveChartData();
    })
  }


  loadAnnonceCountByYear(): void {
    this.kpiService.getCountAnnoncesConducteurByYear().subscribe(data => {
      this.annonceCountByYear = data;
      this.updateYearChartData();
    });
  }

  loadAnnonceCountByMonth(): void {
    this.kpiService.getCountAnnoncesConducteurByMonth().subscribe(data => {
      this.annonceCountByMonth = data;
      this.updateMonthChartData();
    });
  }

  loadAnnonceCountByRayon(): void {
  // Vider le tableau avant de charger de nouvelles données
  this.annonceCountByRayon = [];

  // Charger les données pour chaque rayon
  this.kpiService.getCountAnnoncesConducteurByRayon('GrandTUNIS').subscribe(count => {
    this.annonceCountByRayon.push({ rayon: 'GrandTUNIS', count: count });
    this.updatePieChartRayonData();
  });

  this.kpiService.getCountAnnoncesConducteurByRayon('SFAX').subscribe(count => {
    this.annonceCountByRayon.push({ rayon: 'SFAX', count: count });
    this.updatePieChartRayonData();
  });

  this.kpiService.getCountAnnoncesConducteurByRayon('TouteLaTunisie').subscribe(count => {
    this.annonceCountByRayon.push({ rayon: 'TouteLaTunisie', count: count });
    this.updatePieChartRayonData();
  });
}


  loadAnnonceCountPassengerByYear(): void {
    this.kpiService.getCountAnnoncesPassengerByYear().subscribe(data => {
      this.annonceCountByYear = data;
      this.updateYearChartData();
    });
  }

  loadAnnonceCountPassengerByMonth(): void {
    this.kpiService.getCountAnnoncesPassengerByMonth().subscribe(data => {
      this.annonceCountByMonth = data;
      this.updateMonthChartData();
    });
  }

  loadAnnonceCountPassengerByRayon(): void {
    // Vider le tableau avant de charger de nouvelles données
    this.annonceCountByRayon = [];
  
    // Charger les données pour chaque rayon
    this.kpiService.getCountAnnoncesPassenerByRayon('GrandTUNIS').subscribe(count => {
      this.annonceCountByRayon.push({ rayon: 'GrandTUNIS', count: count });
      this.updatePieChartRayonData();
    });
  
    this.kpiService.getCountAnnoncesPassenerByRayon('SFAX').subscribe(count => {
      this.annonceCountByRayon.push({ rayon: 'SFAX', count: count });
      this.updatePieChartRayonData();
    });
  
    this.kpiService.getCountAnnoncesPassenerByRayon('TouteLaTunisie').subscribe(count => {
      this.annonceCountByRayon.push({ rayon: 'TouteLaTunisie', count: count });
      this.updatePieChartRayonData();
    });
  }
  

  updateYearChartData(): void {
    const labels = this.annonceCountByYear.map(item => item[0]);
    const data = this.annonceCountByYear.map(item => item[1]);

    const backgroundColor = this.isDriverChart ? 'rgba(75, 192, 192, 0.2)' : 'rgba(241, 221, 56, 0.5)';
    const borderColor = this.isDriverChart ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)';

    this.yearChartData = {
      labels: labels,
      datasets: [
        { 
          label: 'Nombre d\'annonces par année', 
          data: data, 
          backgroundColor: backgroundColor, 
          borderColor: borderColor, 
          borderWidth: 1 
        }
      ]
    };
  }

  updateMonthChartData(): void {
    const labels = this.annonceCountByMonth.map(item => `${item[0]}-${item[1]}`);
    const data = this.annonceCountByMonth.map(item => item[2]);

    const backgroundColor = this.isDriverChart ? 'rgba(255, 159, 64, 0.2)' : 'rgba(204, 255, 102, 0.5)';
    const borderColor = this.isDriverChart ? 'rgba(255, 159, 64, 1)' : 'rgba(255, 206, 86, 1)';

    this.monthChartData = {
      labels: labels,
      datasets: [
        { 
          label: 'Nombre d\'annonces par mois', 
          data: data, 
          backgroundColor: backgroundColor, 
          borderColor: borderColor, 
          borderWidth: 1 
        }
      ]
    };
  }

  updatePriveChartData(): void {
    const labels = this.annonceCountByPrice.map(item => item[0]);
    const data = this.annonceCountByPrice.map(item => item[1]);

    const backgroundColor = this.isDriverChart ? 'rgba(241, 83, 55, 0.2)' : 'rgba(241, 221, 56, 0.8)';
    const borderColor = this.isDriverChart ? 'rgba(75, 192, 192, 1)' : 'rgba(153, 102, 255, 1)';

    this.priceChartData = {
      labels: labels,
      datasets: [
        { 
          label: 'Nombre d\'annonces par prix', 
          data: data, 
          backgroundColor: backgroundColor, 
          borderColor: borderColor, 
          borderWidth: 1 
        }
      ]
    };
  }

  updatePieChartRayonData(): void {
    const labels = this.annonceCountByRayon.map(item => item.rayon);
    const data = this.annonceCountByRayon.map(item => item.count);

    const backgroundColor = this.isDriverChart 
      ? ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)']
      : ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'];
    const borderColor = this.isDriverChart 
      ? ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)']
      : ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'];

    this.pieChartDataSet = {
      labels: labels,
      datasets: [
        {
          label: 'Nombre d\'annonces par rayon',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1
        }
      ]
    };
  }

  switchToDriverCharts(): void {
    this.isDriverChartSelected = true;
    this.isPassengerChartSelected = false;
    this.loadDriverCharts();
    this.scrollToSection('chartButtons');

  }

  switchToPassengerCharts(): void {
    this.isDriverChartSelected = false;
    this.isPassengerChartSelected = true;
    this.loadPassengerCharts();
    this.scrollToSection('chartButtons');


  }

  switchChart(chart: string,sectionId: string): void {
    this.currentChart = chart;
    this.scrollToSection(sectionId);
    this.scrollToSection('chartButtons');


  }
  scrollToSection(sectionId: string): void {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'auto',  inline: 'nearest' });

    }
  }
}
