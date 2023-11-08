import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common'; // Import DatePipe
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = ['Device', 'Date', 'Time', 'ORP', 'Pump1', 'Pump2'];
  dataSource = new MatTableDataSource<Devices>(ELEMENT_DATA);
  panelOpenState = false;
  first_device!:string;
  
  constructor(private snackBar: MatSnackBar, private authService: AuthService, private dashDataService: DashDataServiceService, private datePipe: DatePipe) {} // Inject DatePipe

  device_uid = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  dataSource2: any;
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;

  ngOnInit() {
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

  deviceList() {
    const CompanyEmail = sessionStorage.getItem('companyEmail');
    if (CompanyEmail) {
      this.dashDataService.deviceDetails(CompanyEmail).subscribe(
        (device) => {
          this.dataSource2 = device.devices;
          this.first_device = this.dataSource2[0].device_uid;
          const deviceId = sessionStorage.getItem('defaultDevice');
          if(deviceId === null){
            sessionStorage.setItem('defaultDevice',this.first_device);
            this.setDefaultValue();
          }else{
            const reportData = {
              device_uid: sessionStorage.getItem('defaultDevice'),
              start_time: sessionStorage.getItem('start_date'),
              end_time: sessionStorage.getItem('end_date'),
            }
        
            this.dashDataService.reportData(reportData).subscribe(
              (data) => {
                this.dataSource.data = data.data;
                this.dataSource.paginator = this.paginator;
              },
              (error) => {
        
              }
            );
          }       
        },
        (error) => {
          console.log("Error while fetching the device List");
        }
      );
    }
  }

  setDefaultValue(){
    const previousDate = new Date(this.currentDate);
      previousDate.setDate(this.currentDate.getDate() - 1);
      const formattedStartDate = this.datePipe.transform(previousDate, 'yyyy-MM-dd HH:mm:ss')??'';
    sessionStorage.setItem('start_date',formattedStartDate)

      const formattedEndDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss')??'';
    sessionStorage.setItem('end_date',formattedEndDate)

    const reportData = {
      device_uid: sessionStorage.getItem('defaultDevice'),
      start_time: sessionStorage.getItem('start_date'),
      end_time: sessionStorage.getItem('end_date'),
    }

    this.dashDataService.reportData(reportData).subscribe(
      (data) => {
        this.dataSource.data = data.data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {

      }
    );
  }

  applyFilter() {
    if (this.device_uid.valid && this.start_date.valid && this.end_date.valid) {
      const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd HH:mm:ss')??'';
      const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd HH:mm:ss')??'';

      
      const new_uid= this.device_uid.value??'';
      sessionStorage.setItem('defaultDevice',new_uid);
      sessionStorage.setItem('start_date',formattedStartDate)
      sessionStorage.setItem('end_date',formattedEndDate)

      const reportData = {
        device_uid: sessionStorage.getItem('defaultDevice'),
        start_time: sessionStorage.getItem('start_date'),
        end_time: sessionStorage.getItem('end_date'),
      }

      console.log(reportData);

      this.dashDataService.reportData(reportData).subscribe(
        (data) => {
          this.dataSource.data = data.data;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {

        }
      );
    } else {
      this.snackBar.open('Please select fields!', 'Dismiss', {
        duration: 2000
      });
    }
  }
}

export interface Devices {
  device_name: string;
  pump1: string;
  pump2: string;
  Location: string;
  device_latitude: number;
  device_longitude: number;
}

const ELEMENT_DATA: Devices[] = [];
