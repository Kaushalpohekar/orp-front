import { Component, HostListener, Inject } from '@angular/core';
import { DashDataServiceService } from '../../dash-data-service/dash-data-service.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-device',
  templateUrl: './add-device.component.html',
  styleUrls: ['./add-device.component.css']
})
export class AddDeviceComponent {

  userId!: string | null;
  CompanyEmail! :string;
  CompanyName!:string;
  UserType!: string;
  ContactNo!: string;
  PersonalEmail!: string;

  errorMessage = '';
  TriggerValue = new FormControl('', [Validators.required, Validators.pattern(/^\d*\.?\d+$/), Validators.min(0), Validators.max(100)]);
  DeviceName = new FormControl('', [Validators.required]);
  DeviceUID = new FormControl('', [Validators.required]);
  DeviceLocation = new FormControl('', [Validators.required]);

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
    public dialogRef: MatDialogRef<AddDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
  }

  ngOnInit(){
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getThresholdErrorMessage() {
    if (this.TriggerValue.hasError('required')) {
      return 'Threshold is required';
    }
    
    if (this.TriggerValue.hasError('pattern')) {
      return 'Not a valid number';
    }
    
    if (this.TriggerValue.hasError('min')) {
      return 'Not less than 0';
    }
    
    if (this.TriggerValue.hasError('max')) {
      return 'Not more than 100';
    }
    
    return '';
  }
}
