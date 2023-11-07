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

  // Function to update the end date
  updateEndDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedEndDate = event.value;

    // Check if the selected end date is greater than or equal to the start date
    if (!this.startDate || selectedEndDate >= this.startDate) {
      // Update the end date value
      this.endDate = selectedEndDate;
    } else {
      // Reset the end date to the current date or handle the case where the selected end date is before the start date
      this.endDate = this.currentDate;
      // You can also show an error message to the user
      console.error('End date must be greater than or equal to the start date');
    }
  }

  deviceList() {
    const CompanyEmail = sessionStorage.getItem('companyEmail');
    if (CompanyEmail) {
      this.dashDataService.deviceDetails(CompanyEmail).subscribe(
        (device) => {
          this.dataSource2 = device.devices;
        },
        (error) => {
          console.log("Error while fetching the device List");
        }
      );
    }
  }

  applyFilter() {
    if (this.device_uid.valid && this.start_date.valid && this.end_date.valid) {
      // Format the start date using the DatePipe
      const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd HH:mm:ss');
      const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd HH:mm:ss');

      const reportData = {
        device_uid: this.device_uid.value,
        start_time: formattedStartDate,
        end_time: formattedEndDate,
      }

      this.dashDataService.reportData(reportData).subscribe(
        (data) => {
          this.dataSource.data = data.data;
          this.dataSource.paginator = this.paginator;
          console.log(this.dataSource2);
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
