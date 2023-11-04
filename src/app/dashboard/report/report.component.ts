import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'city', 'Date'];
  dataSource = new MatTableDataSource<Devices>(ELEMENT_DATA);
  panelOpenState = false;
  CompanyEmail!: string;

  constructor(private authService: AuthService, private dashDataService: DashDataServiceService) {}


  @ViewChild(MatSort, { static: true }) sort!: MatSort;

  ngOnInit() {
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.deviceList();
  }

  deviceList(){
    if(this.CompanyEmail){
      this.dashDataService.deviceDetails(this.CompanyEmail).subscribe(
        (device) => {
          this.dataSource = device.devices;
        },
        (error) => {
          console.log("Error while fetchingg tthee device List");
        }
      );
    }
  }
}

export interface Devices {
  device_name: string;
  pump1: string;
  pump2: string;
  Location: string;
  device_latitude: number;
  device_longitute: number;
}

const ELEMENT_DATA: Devices[] = [];