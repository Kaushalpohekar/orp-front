import { Component, HostListener, Inject } from '@angular/core';
import { DashDataServiceService } from '../../dash-data-service/dash-data-service.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {

  FirstName = new FormControl('', [Validators.required]);
  LastName = new FormControl('', [Validators.required]);
  PersonalEmail = new FormControl('', [Validators.required, Validators.email]);
  ContactNo = new FormControl('', [Validators.required]);
  UserType = new FormControl('', [Validators.required]);
  Location = new FormControl('', [Validators.required]);
  Designation = new FormControl('', [Validators.required]);
  CompanyEmail!: string;
  CompanyName!: string;
  userId!: string | null;

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
    public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ){
  }

  ngOnInit(){
  }

  getPersonalEmailErrorMessage() {
    if (this.PersonalEmail.hasError('required')) {
      return 'Email is Required';
    }
    return this.PersonalEmail.hasError('email') ? 'Not a valid email' : '';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}