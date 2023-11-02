import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, interval, take } from 'rxjs';
import { AuthService } from 'src/app/login/auth/auth.service';
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

  UserId!: string | null;
  totalUsers: number = 0;
  totalOnlineUsers: number = 0;
  totalOfflineUsers: number = 0;
  totalDevices: number = 0;
  totalActiveDevices: number = 0;
  totalInactiveDevices: number = 0;
  dataSource: any;
  dataSource2: any;
  displayedColumns: string[] = ['Name', 'UserName', 'Contact', 'UserType'];

  constructor(
    private authService: AuthService,
    private dashDataService: DashDataServiceService
  ) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.UserId = sessionStorage.getItem('UserId');
    if (this.UserId) {
      this.dashDataService.userDetails(this.UserId).subscribe(
        (users) => {
          this.dataSource=users.getUserById;
        },
        (error) => {
          // Handle error
        }
      );
    }
  }

}

