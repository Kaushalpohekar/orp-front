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
  analyticsFirstDevice!:string;
  device_uid = new FormControl('',[Validators.required]);
  CompanyEmail!: string;
  devices!: any[];
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);
  orpData: any[] = [];

  dataStatus = [
    { status: 'online', percentage: 25.5 },
    { status: 'heating', percentage: 10.2 },
    { status: 'idle', percentage: 64.3 }
  ];
  dataSource2: any;

  ngOnInit() {
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
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
          this.analyticsFirstDevice = this.dataSource2[0].device_uid;
          const deviceId = sessionStorage.getItem('analyticsDefaultDevice');
          if(deviceId === null){
            sessionStorage.setItem('analyticsDefaultDevice',this.analyticsFirstDevice);
            this.setDefaultValue();
          }else{
            const custom_interval = sessionStorage.getItem('analyticsDefaultDevice');
            if(custom_interval === 'Custom'){
              
            }
          }
        },
        (error) => {
          console.log("Error while fetching the device List");
        }
      );
    }
  }

  setDefaultValue(){
    const setting_interval = sessionStorage.setItem('analytics_interval','day');
    const device_uid= sessionStorage.getItem('analyticsDefaultDevice');
    const interval = sessionStorage.getItem('analytics_interval');

    this.dashDataService.analyticsDataByIntervalForPieChart(device_uid, interval).subscribe(
      (pieData) => {
        console.log(pieData);
        this.createDonutChart(pieData);
        this.dashDataService.analyticsDataByIntervalForLineChart(device_uid, interval).subscribe(
          (lineData) => {

            if (Array.isArray(lineData.data)) {
              this.orpData = lineData.data.map((entry: any) => {
                const timestamp = new Date(entry.date_time).getTime();
                const orp = parseInt(entry.orp);
                return [timestamp, orp];
              });

              console.log(this.orpData);
              this.createLineChart();
              // rest of your code
            } else {
              console.error("Line data array not found:", lineData);
            } 
            this.dashDataService.analyticsDataByIntervalForBarChart(device_uid, interval).subscribe(
              (barData) => {
                console.log(barData);  
                this.createBarChart(barData);   
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
      },
      (error) => {
        console.log("Api is nt Working");
      }
    );
  }

  applyFilterInterval(interval: string){
    if(this.device_uid.valid && interval){
      const device_uid = this.device_uid.value??'';
      sessionStorage.setItem('analyticsDefaultDevice',device_uid);
      console.log("Selected Value", interval, device_uid);
      this.dashDataService.analyticsDataByIntervalForPieChart(device_uid, interval).subscribe(
        (pieData) => {
          console.log(pieData);
          this.createDonutChart(pieData);
          this.dashDataService.analyticsDataByIntervalForLineChart(device_uid, interval).subscribe(
            (lineData) => {

              if (Array.isArray(lineData.data)) {
                this.orpData = lineData.data.map((entry: any) => {
                  const timestamp = new Date(entry.date_time).getTime();
                  const orp = parseInt(entry.orp);
                  return [timestamp, orp];
                });

                console.log(this.orpData);
                this.createLineChart();
                // rest of your code
              } else {
                console.error("Line data array not found:", lineData);
              } 
              this.dashDataService.analyticsDataByIntervalForBarChart(device_uid, interval).subscribe(
                (barData) => {
                  console.log(barData);  
                  this.createBarChart(barData);   
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
          this.createDonutChart(pieData);
          this.dashDataService.analyticsDataByCustomForLineChart(analyticsData).subscribe(
            (lineData) => {
              console.log(lineData);
              this.createLineChart();
              this.dashDataService.analyticsDataByCustomForBarChart(analyticsData).subscribe(
                (barData) => {
                  console.log(barData);
                  this.createBarChart(barData);  
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
    // Define an array of colors for each segment
    const colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0'];

    // Convert dynamic data to an array for the chart with colors
    const donutChartData = Object.entries(dataStatus).map(([key, value], index: number) => {
        // Convert hours to minutes and hours
        const totalMinutes = Math.floor((value as number) * 60);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        return {
            name: key,
            y: totalMinutes,
            hours,
            minutes,
            color: colors[index % colors.length] // Use modulus to loop through colors
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
            pointFormat: '{series.name}: <b>{point.hours}h {point.minutes}m</b>'
        },
        series: [{
            type: 'pie',
            name: 'Status',
            data: donutChartData
        }]
    };

    Highcharts.chart('donutChart', options);
  }

  createBarChart(barData: any[]) {
    const categories = barData.map(entry => entry.date);
    const pump1OnTime = barData.map(entry => entry.pump1OnTime);
    const pump2OnTime = barData.map(entry => entry.pump2OnTime);
    const combinedOfflineTime = barData.map(entry => entry.combinedOfflineTime);
    const powerCutTime = barData.map(entry => entry.powerCutTime);

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
        categories: categories,
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total Hours'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                     '<td style="padding:0"><b>{point.y:.2f} hours</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          stacking: 'normal'
        }
      },
      series: [{
        name: 'Pump 1 On Time',
        data: pump1OnTime
      }, {
        name: 'Pump 2 On Time',
        data: pump2OnTime
      }, {
        name: 'Combined Offline Time',
        data: combinedOfflineTime
      }, {
        name: 'Power Cut Time',
        data: powerCutTime
      }] as Highcharts.SeriesColumnOptions[]
    };

    Highcharts.chart('barChart', options);
  }

  createLineChart() {
    Highcharts.chart('lineChart', {
      chart: {
        type: 'spline'
      },
      title: {
        text: ''
      },
      credits: {
            enabled: false // Disable the credits display
          },

      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Temperature'
        },
        min: 450,
        max: 600,
      },
      series: [{
        name: 'Temperature',
        color: {
          linearGradient: {
            x1: 0,
            x2: 0,
            y1: 0,
            y2: 1
          },
          stops: [
            [0, 'rgba(255, 0, 0, 1)'],    // Start color (red)
            [1, 'rgba(255, 255, 0, 0.3)'] // End color (yellow)
          ]
        },
        data: this.orpData
      }] as any
    } as Highcharts.Options);
  }


}
