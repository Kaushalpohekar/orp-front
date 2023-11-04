import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'city', 'Date'];
  dataSource = new MatTableDataSource<Person>(ELEMENT_DATA);
  panelOpenState = false;
  device_uid=new FormControl('',[Validators.required]);
  start_date=new FormControl('',[Validators.required]);
  end_date=new FormControl('',[Validators.required]);

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  dataSource2: any;
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;

  constructor(public dashDataService:DashDataServiceService){}

  ngOnInit() {
    this.dataSource.sort = this.sort;
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

  deviceList(){
    const CompanyEmail = sessionStorage.getItem('companyEmail')
    if(CompanyEmail){
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
}

export interface Person {
  name: string;
  age: number;
  city: string;
  Date: string;
}

const ELEMENT_DATA: Person[] = [
  { name: 'Alice', age: 28, city: 'New York', Date: "10-20-2023" },
  { name: 'Bob', age: 22, city: 'Los Angeles', Date: "10-20-2023" },
  { name: 'Alice', age: 28, city: 'New York', Date: "10-20-2023" },
  { name: 'Bob', age: 22, city: 'Los Angeles', Date: "10-20-2023" },
  { name: 'Alice', age: 28, city: 'New York', Date: "10-20-2023" },
  { name: 'Bob', age: 22, city: 'Los Angeles', Date: "10-20-2023" },
  // Add more data entries as needed
];