import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashDataServiceService } from '../../dash-data-service/dash-data-service.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit{

  FirstName = new FormControl('', [Validators.required]);
  LastName = new FormControl('', [Validators.required]);
  PersonalEmail = new FormControl('', [Validators.required, Validators.email]);
  ContactNo = new FormControl('', [Validators.required]);
  UserType = new FormControl('', [Validators.required]);
  Location = new FormControl('', [Validators.required]);
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

  onSave(){
    if(this.FirstName.valid && this.LastName.valid && this.PersonalEmail.valid && this.ContactNo.valid && this.UserType.valid){
      
      const CEmail=sessionStorage.getItem('companyEmail');
      const CName=sessionStorage.getItem('companyName');

      const userData={
        userName:this.PersonalEmail.value, 
        password:this.PersonalEmail.value, 
        firstName:this.FirstName.value, 
        lastName:this.LastName.value, 
        contactNo:this.ContactNo.value, 
        userType:this.UserType.value, 
        location:this.Location.value,
        companyEmail:CEmail,
        companyName:CName,
      }

      this.DashDataService.addUser(userData).subscribe(
          () => {
          this.snackBar.open('User Added successfully!', 'Dismiss', {
            duration: 2000
          });
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open('Failed. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
        }
      );
    }    
  }
}
