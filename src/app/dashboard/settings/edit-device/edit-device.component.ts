import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashDataServiceService } from '../../dash-data-service/dash-data-service.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css']
})
export class EditDeviceComponent  implements OnInit{
  CompanyEmail! :string;
  CompanyName!:string;
  UserType!: string;
  ContactNo!: string;
  PersonalEmail!: string;
  device:any;
  deviceId!:string;

  errorMessage = '';
  DeviceLongitude = new FormControl('', [Validators.required]);
  DeviceName = new FormControl('', [Validators.required]);
  DeviceUID = new FormControl('', [Validators.required]);
  DeviceLatitude = new FormControl('', [Validators.required]);

  @HostListener('window:resize')
  onWindowResize() {
    this.adjustDialogWidth();
  }
  private adjustDialogWidth() {
    const screenWidth = window.innerWidth;
    if (screenWidth <= 600) {
      this.dialogRef.updateSize('90%', '');
    } else if (screenWidth <= 960) {
      this.dialogRef.updateSize('70%', '');
    } else {
      this.dialogRef.updateSize('400px', '');
    }
  }
  constructor(
    private DashDataService: DashDataServiceService,
    private authService: AuthService,
    public snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
    this.device=data.devices;
    this.deviceId=this.device.entry_id;
  }

  ngOnInit(){
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(){
    if(this.DeviceLatitude.valid && this.DeviceLongitude.valid && this.DeviceUID.valid && this.DeviceName.valid){
      
      const Email=sessionStorage.getItem('companyEmail');

      const deviceData={
        device_uid: this.DeviceUID.value, 
        device_longitute: this.DeviceLongitude.value, 
        device_latitude: this.DeviceLatitude.value, 
        device_name: this.DeviceName.value, 
        company_email: Email
      }

      this.DashDataService.editDevice(this.deviceId,deviceData).subscribe(
          () => {
          this.snackBar.open('Device Updated successfully!', 'Dismiss', {
            duration: 2000
          });
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open('Failed to update device data. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
          this.dialogRef.close();
        }
      );
    }    
  }
}
