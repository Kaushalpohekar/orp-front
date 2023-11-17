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
  ) {}

  ngOnInit(): void{
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.startInterval();
  }

  ngOnDestroy() {
    this.stopInterval();
  }

  startInterval() {
    this.intervalSubscription = interval(2000)
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
        },
        (error) => {
          console.log("Error while fetchingg tthee device List");
        }
      );
    }
  }

  deleteUser(user:any){
    const userID = user.UserId;
    if(userID){
      this.dashDataService.deleteUser(userID).subscribe(
        () => {
          this.snackBar.open('User Deleted successfully!', 'Dismiss', {
            duration: 2000
          });
        },
        (error) => {
          this.snackBar.open('Failed to delete User. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      )
    }
  }

  deleteDevice(device:any){
    const deviceID = device.device_uid;
    if(deviceID){
      this.dashDataService.deleteDevice(deviceID).subscribe(
        () => {
          this.snackBar.open('Device Deleted successfully!', 'Dismiss', {
            duration: 2000
          });
        },
        (error) => {
          this.snackBar.open('Failed to delete device. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      )
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
        },
        (error) => {
          console.log("Error while fetching the device List");
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

