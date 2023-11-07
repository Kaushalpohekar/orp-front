import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit{

  selectedValue!: string;
  device_uid = new FormControl('',[Validators.required]);
  CompanyEmail!: string;
  devices!: any[];

  dataStatus = [
    { status: 'online', percentage: 25.5 },
    { status: 'heating', percentage: 10.2 },
    { status: 'idle', percentage: 64.3 }
  ];
  dataSource2: any;

  ngOnInit() {
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.createDonutChart(this.dataStatus);
    this.createBarChart();
    this.createLineChart();
    this.deviceList();
  }

  constructor(private authService: AuthService, public dashDataService : DashDataServiceService){
    
  }

  deviceList(){
    if(this.CompanyEmail){
      this.dashDataService.deviceDetails(this.CompanyEmail).subscribe(
        (device) => {
          this.devices = device.devices;
        },
        (error) => {
          console.log("Error while fetchingg tthee device List");
        }
      );
    }
  }

  applyFilterInterval(interval: string){
    if(this.device_uid.valid && interval){
      const device_uid = this.device_uid.value;
      console.log("Selected Value", interval, device_uid);
    } else {
      console.log("Select device_uid Firrst");
    } 
  }

  createDonutChart(dataStatus: any) {
    const donutChartData = dataStatus.map((entry: any) => {
      const formattedPercentage = parseFloat(entry.percentage.toFixed(2)); // Format to two decimal places
      return {
        name: entry.status,
        y: formattedPercentage
      };
    });

    const options: Highcharts.Options = {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '50%'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}%</b>'
      },
      series: [{
        type: 'pie',
        name: 'Status',
        data: donutChartData
      }]
    };

    Highcharts.chart('donutChart', options);
  }

  createBarChart() {
    const barChartData = [10, 20, 30, 40, 50]; // Replace with your own data

    const options: Highcharts.Options = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        type: 'column', // Add the type property
        name: 'Bar Data',
        data: barChartData
      }]
    };

    Highcharts.chart('barChart', options);
  }

  createLineChart() {
    const lineChartData = [10, 15, 20, 25, 30, 12, 15, 20, 24, 25, 22 ]; // Replace with your own data

    const options: Highcharts.Options = {
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'june', 'july', 'aug', 'seept', 'oct', 'nov']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        type: 'line', // Add the type property
        name: 'Line Data',
        data: lineChartData
      }]
    };

    Highcharts.chart('lineChart', options);
  }


}
