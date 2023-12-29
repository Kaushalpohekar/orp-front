import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription, interval, take } from 'rxjs';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { DatePipe } from '@angular/common';
import { AddUserComponent } from './add-user/add-user.component';
import { AddDeviceComponent } from './add-device/add-device.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditDeviceComponent } from './edit-device/edit-device.component';
import Swal from 'sweetalert2';
import { DashService } from '../dash.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{

  CompanyEmail!: string;
  UserId!: string | null;
  totalUsers: number = 0;
  totalDevices: number = 0;
  dataSource: any;
  dataSource2: any;
  displayedColumns: string[] = ['Name', 'UserName', 'Contact', 'Action'];
  displayedColumns2: string[] = ['Device', 'Location', 'Date of Isssue', 'Action'];
  intervalSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private dashDataService: DashDataServiceService,
    private datePipe: DatePipe,
    private dialog:MatDialog,
    public snackBar: MatSnackBar,
    public dashService :DashService
  ) {}

  ngOnInit(): void{
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.startInterval();
    this.dashService.isPageLoading(true);
  }

  ngOnDestroy() {
    this.stopInterval();
  }

  startInterval() {
    this.intervalSubscription = interval(5000)
      .pipe(take(Infinity))
      .subscribe(() => {
        this.fetchData();
      });
  }

  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  fetchData() {
    this.deviceList();
    this.userList();
  }

  userList(){
    if(this.CompanyEmail){
      this.dashDataService.userDetails(this.CompanyEmail).subscribe(
        (user) => {
          this.dataSource = user.users;
          this.totalUsers = this.dataSource.length;
          this.dashService.isPageLoading(false);
        },
        (error) => {
          this.snackBar.open('Error while fetching Devices Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  deleteUser(user: any) {
    const userID = user.UserId;
    if (userID) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dashDataService.deleteUser(userID).subscribe(
            () => {
              Swal.fire('Deleted!', 'User has been deleted.', 'success');
            },
            (error) => {
              Swal.fire('Error!', 'Failed to delete user. Please try again.', 'error');
            }
          );
        }
      });
    }
  }

  deleteDevice(device: any) {
    const deviceID = device.device_uid;
    if (deviceID) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'You won\'t be able to revert this!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.dashDataService.deleteDevice(deviceID).subscribe(
            () => {
              Swal.fire('Deleted!', 'Device has been deleted.', 'success');
            },
            (error) => {
              Swal.fire('Error!', 'Failed to delete device. Please try again.', 'error');
            }
          );
        }
      });
    }
  }

  deviceList(){
    if(this.CompanyEmail){
      this.dashDataService.deviceDetails(this.CompanyEmail).subscribe(
        (device) => {
          this.dataSource2 = device.devices.map((d: any) => ({
            DateOfIssue: this.datePipe.transform(d.issue_date, 'dd-MM-yyyy'),
            device_name:d.device_name,
            device_uid:d.device_uid,   
            device_latitude:d.device_latitude,
            device_longitude:d.device_longitute,
            entry_id:d.entry_id,  
            Location:d.Location
          }));
          this.totalDevices = this.dataSource2.length;
          this.dashService.isPageLoading(false);
        },
        (error) => {
          this.snackBar.open('Error while fetching devices Data!', 'Dismiss', {
            duration: 2000
          });
        }
      );
    }
  }

  openAddUserDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {});
  }

  openAddDeviceDialog(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    const dialogRef = this.dialog.open(AddDeviceComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(deviceAdded => {});
  }

  openEditUserDialog(user:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.data = {user};
    const dialogRef = this.dialog.open(EditUserComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {});
  }

  openEditDeviceDialog(devices:any): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '500px';
    dialogConfig.height = 'auto';
    dialogConfig.maxWidth = '90vw';
    dialogConfig.data = {devices};
    const dialogRef = this.dialog.open(EditDeviceComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(userAdded => {});
  }

}

