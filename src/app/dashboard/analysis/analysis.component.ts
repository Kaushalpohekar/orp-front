import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { Subscription, interval, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  intervalSubscription: Subscription | undefined;

  id!: string|null;
  start!: string|null;
  end!: string|null;
  cInterval!: string|null;

  ngOnDestroy() {
    this.stopInterval();
  }

  startInterval() {
    this.intervalSubscription = interval(1000)
      .pipe(take(Infinity))
      .subscribe(() => {
        this.defaultData();
      });
  }

  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  defaultData(){    
    this.id = sessionStorage.getItem('analyticsDefaultDevice');
    this.cInterval = sessionStorage.getItem('analytics_interval');
    if(this.cInterval === 'custom'){
      const s = sessionStorage.getItem('analytics_start_date');
      this.start = this.datePipe.transform(s, 'yyyy-MM-dd')??'';
      const e = sessionStorage.getItem('analytics_end_date');
      this.end = this.datePipe.transform(e, 'yyyy-MM-dd')??'';
    }
    else{
      this.start = '';
      this.end = '';
    }
  }

  dataStatus = [
    { status: 'online', percentage: 25.5 },
    { status: 'heating', percentage: 10.2 },
    { status: 'idle', percentage: 64.3 }
  ];
  dataSource2: any;

  ngOnInit() {
    this.deviceList();
    this.startInterval();
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

  constructor(private authService: AuthService, public dashDataService : DashDataServiceService, private datePipe: DatePipe,private snackBar:MatSnackBar){
    
  }

  deviceList(){
    const CompanyEmail = sessionStorage.getItem('companyEmail');
    if(CompanyEmail){
      this.dashDataService.deviceDetails(CompanyEmail).subscribe(
        (device) => {
          this.dataSource2 = device.devices;
          this.analyticsFirstDevice = this.dataSource2[0].device_uid;
          const deviceId = sessionStorage.getItem('analyticsDefaultDevice');
          if(deviceId === null){
            sessionStorage.setItem('analyticsDefaultDevice',this.analyticsFirstDevice);
            this.setDefaultValue();
          }else{
            const custom_interval = sessionStorage.getItem('analytics_interval');
            if(custom_interval === 'custom'){
              const analyticsData ={
                device_uid: sessionStorage.getItem('analyticsDefaultDevice'),
                start_time: sessionStorage.getItem('analytics_start_date'),
                end_time: sessionStorage.getItem('analytics_end_date'),
              }
              this.dashDataService.analyticsDataByCustomForPieChart(analyticsData).subscribe(
                (pieData) => {
                  this.createDonutChart(pieData);
                  this.dashDataService.analyticsDataByCustomForLineChart(analyticsData).subscribe(
                    (lineData) => {
                      this.createLineChart();
                      this.dashDataService.analyticsDataByCustomForBarChart(analyticsData).subscribe(
                        (barData) => {
                          this.createBarChart(barData);  
                        },
                        (error) => {
                          this.snackBar.open('Failed to load Bar data!', 'Dismiss', {
                            duration: 2000
                            });
                        }
                      );
                    },
                    (error) => {
                      this.snackBar.open('Failed to load Line data!', 'Dismiss', {
                        duration: 2000
                        });
                    }
                  );
                },
                (error) => {
                  this.snackBar.open('Failed to load Pie Data!', 'Dismiss', {
                    duration: 2000
                    });
                }
              );
            }
            else if(custom_interval != null){
              const device_uid = sessionStorage.getItem('analyticsDefaultDevice');
              const interval = sessionStorage.getItem('analytics_interval');
              this.dashDataService.analyticsDataByIntervalForPieChart(device_uid, interval).subscribe(
                (pieData) => {
                  this.createDonutChart(pieData);
                  this.dashDataService.analyticsDataByIntervalForLineChart(device_uid, interval).subscribe(
                    (lineData) => {
          
                      if (Array.isArray(lineData.data)) {
                        this.orpData = lineData.data.map((entry: any) => {
                          const timestamp = new Date(entry.date_time).getTime();
                          const orp = parseInt(entry.orp);
                          return [timestamp, orp];
                        });
                        this.createLineChart();
                      } else {
                        this.snackBar.open('Line Data Array Not Found!', 'Dismiss', {
                          duration: 2000
                          });
                      } 
                      this.dashDataService.analyticsDataByIntervalForBarChart(device_uid, interval).subscribe(
                        (barData) => {
                          this.createBarChart(barData);   
                        },
                        (error) => {
                          this.snackBar.open('Failed to load Bar data!', 'Dismiss', {
                        duration: 2000
                        });
                        }
                      );     
                    },
                    (error) => {
                      this.snackBar.open('Failed to load Line data!', 'Dismiss', {
                        duration: 2000
                        });
                    }
                  );
                },
                (error) => {
                  this.snackBar.open('Failed to load Pie Data!', 'Dismiss', {
                        duration: 2000
                        });
                }
              );
            }
            else{
              this.snackBar.open('No Data Available!', 'Dismiss', {
                duration: 2000
                });
            }
          }
        },
        (error) => {
          this.snackBar.open('Error while fetching Device Data!', 'Dismiss', {
            duration: 2000
            });
        }
      );
    }
  }

  setDefaultValue(){
    sessionStorage.setItem('analytics_interval','day');
    const device_uid= sessionStorage.getItem('analyticsDefaultDevice');
    const interval = sessionStorage.getItem('analytics_interval');

    this.dashDataService.analyticsDataByIntervalForPieChart(device_uid, interval).subscribe(
      (pieData) => {
        this.createDonutChart(pieData);
        this.dashDataService.analyticsDataByIntervalForLineChart(device_uid, interval).subscribe(
          (lineData) => {
            if (Array.isArray(lineData.data)) {
              this.orpData = lineData.data.map((entry: any) => {
                const timestamp = new Date(entry.date_time).getTime();
                const orp = parseInt(entry.orp);
                return [timestamp, orp];
              });
              this.createLineChart();
            } else {
              this.snackBar.open('Line Data Array Not Found!', 'Dismiss', {
                duration: 2000
                });
            } 
            this.dashDataService.analyticsDataByIntervalForBarChart(device_uid, interval).subscribe(
              (barData) => { 
                this.createBarChart(barData);   
              },
              (error) => {
                this.snackBar.open('Failed to load Bar data!', 'Dismiss', {
                  duration: 2000
                  });
              }
            );     
          },
          (error) => {
            this.snackBar.open('Failed to load Line data!', 'Dismiss', {
              duration: 2000
              });
          }
        );
      },
      (error) => {
        this.snackBar.open('Failed to load Pie Data!', 'Dismiss', {
          duration: 2000
          });
      }
    );
  }

  applyFilterInterval(interval: string){
    if(this.device_uid.valid && interval){
      sessionStorage.setItem('analytics_interval',interval)
      const device_uid = this.device_uid.value??'';
      sessionStorage.setItem('analyticsDefaultDevice',device_uid);
      this.dashDataService.analyticsDataByIntervalForPieChart(device_uid, interval).subscribe(
        (pieData) => {
          this.createDonutChart(pieData);
          this.dashDataService.analyticsDataByIntervalForLineChart(device_uid, interval).subscribe(
            (lineData) => {

              if (Array.isArray(lineData.data)) {
                this.orpData = lineData.data.map((entry: any) => {
                  const timestamp = new Date(entry.date_time).getTime();
                  const orp = parseInt(entry.orp);
                  return [timestamp, orp];
                });
                this.createLineChart();
              } else {
                this.snackBar.open('Line Data Array Not Found!', 'Dismiss', {
                  duration: 2000
                  });
              } 
              this.dashDataService.analyticsDataByIntervalForBarChart(device_uid, interval).subscribe(
                (barData) => {
                  this.createBarChart(barData);   
                },
                (error) => {
                  this.snackBar.open('Failed to load Bar data!', 'Dismiss', {
                    duration: 2000
                    });
                }
              );     
            },
            (error) => {
              this.snackBar.open('Failed to load Line data!', 'Dismiss', {
                duration: 2000
                });
            }
          );
        },
        (error) => {
          this.snackBar.open('Failed to load Bar data!', 'Dismiss', {
            duration: 2000
            });
        }
      );
    } else {
      this.snackBar.open('No data Available!', 'Dismiss', {
        duration: 2000
        });
    } 
  }

  applyCustomFilter(){
    sessionStorage.setItem('analytics_interval','custom');
    if(this.start_date.valid && this.end_date.valid && this.device_uid.valid){
      const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd HH:mm:ss')??'';
      const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd HH:mm:ss')??'';
      sessionStorage.setItem('analytics_start_date',formattedStartDate)
      sessionStorage.setItem('analytics_end_date',formattedEndDate)

      const analyticsData ={
        device_uid : this.device_uid.value,
        start_time : formattedStartDate,
        end_time : formattedEndDate
      }
      this.dashDataService.analyticsDataByCustomForPieChart(analyticsData).subscribe(
        (pieData) => {
          this.createDonutChart(pieData);
          this.dashDataService.analyticsDataByCustomForLineChart(analyticsData).subscribe(
            (lineData) => {
              this.createLineChart();
              this.dashDataService.analyticsDataByCustomForBarChart(analyticsData).subscribe(
                (barData) => {
                  this.createBarChart(barData);  
                },
                (error) => {
                  this.snackBar.open('Failed to load Bar data!', 'Dismiss', {
                    duration: 2000
                  });
                }
              );
            },
            (error) => {
              this.snackBar.open('Failed to load Line data!', 'Dismiss', {
                duration: 2000
              });
            }
          );
        },
        (error) => {
          this.snackBar.open('Failed to load Pie Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    } else {
      this.snackBar.open('No Data Available!', 'Dismiss', {
        duration: 2000
        });
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
          text: 'ORP'
        },
        min: 450,
        max: 600,
      },
      series: [{
        name: 'ORP',
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
