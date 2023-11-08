import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

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
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);

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

  updateStartDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedStartDate = event.value;
    this.startDate = selectedStartDate;
  }

  updateEndDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedEndDate = event.value;
    if (!this.startDate || selectedEndDate >= this.startDate) {
      this.endDate = selectedEndDate;
    } else {
      this.endDate = this.currentDate;
      console.error('End date must be greater than or equal to the start date');
    }
  }

  constructor(private authService: AuthService, public dashDataService : DashDataServiceService, private datePipe: DatePipe){
    
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
      this.dashDataService.analyticsDataByIntervalForPieChart(device_uid, interval).subscribe(
        (pieData) => {
          console.log(pieData);
          this.dashDataService.analyticsDataByIntervalForLineChart(device_uid, interval).subscribe(
            (lineData) => {
              console.log(lineData);     
            },
            (error) => {
              console.log("Api is nt Working");
            }
          );
        },
        (error) => {
          console.log("Api is nt Working");
        }
      );
    } else {
      console.log("Select device_uid First");
    } 
  }

  applyCustomFilter(){
    if(this.start_date.valid && this.end_date.valid && this.device_uid.valid){


      const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd HH:mm:ss')??'';
      const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd HH:mm:ss')??'';


      const analyticsData ={
        device_uid : this.device_uid.value,
        start_time : formattedStartDate,
        end_time : formattedEndDate
      }
      this.dashDataService.analyticsDataByCustomForPieChart(analyticsData).subscribe(
        (pieData) => {
          console.log(pieData);
          this.dashDataService.analyticsDataByCustomForLineChart(analyticsData).subscribe(
            (lineData) => {
              console.log(lineData);
            },
            (error) => {
              console.log("Api is nt Working");
            }
          );
        },
        (error) => {
          console.log("Api is nt Working");
        }
      );
      console.log(analyticsData);
    } else {
      console.log("select dates first");
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
