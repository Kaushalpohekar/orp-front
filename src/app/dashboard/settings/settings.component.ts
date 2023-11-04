import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, interval, take } from 'rxjs';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { DatePipe } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{

  CompanyEmail!: string;
  UserId!: string | null;
  totalUsers: number = 0;
  totalOnlineUsers: number = 0;
  totalOfflineUsers: number = 0;
  totalDevices: number = 0;
  totalActiveDevices: number = 0;
  totalInactiveDevices: number = 0;
  dataSource: any;
  dataSource2: any;
  displayedColumns: string[] = ['Name', 'UserName', 'Contact', 'Action'];
  displayedColumns2: string[] = ['Device', 'Location', 'Date of Isssue', 'Action'];

  constructor(
    private authService: AuthService,
    private dashDataService: DashDataServiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void{
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.deviceList();
    this.userList();
  }

  userList(){
    if(this.CompanyEmail){
      this.dashDataService.userDetails(this.CompanyEmail).subscribe(
        (user) => {
          this.dataSource = user.users;
        },
        (error) => {
          console.log("Error while fetchingg tthee device List");
        }
      );
    }
  }

  deviceList(){
    if(this.CompanyEmail){
      this.dashDataService.deviceDetails(this.CompanyEmail).subscribe(
        (device) => {
          this.dataSource2 = device.devices.map((d: any) => ({
            DateOfIssue: this.datePipe.transform(d.issue_date, 'yyyy-MM-dd'),
            device_uid: d.device_uid,
            device_name: d.device_name,

          }));
        },
        (error) => {
          console.log("Error while fetchingg tthee device List");
        }
      );
    }
  }

}

