import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';

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

  constructor(public dashDataService:DashDataServiceService){}

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.deviceList();
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