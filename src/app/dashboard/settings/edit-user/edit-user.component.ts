import { Component, Inject, HostListener, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from '../../../login/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DashDataServiceService } from '../../dash-data-service/dash-data-service.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent  implements OnInit{

  FirstName = new FormControl('', [Validators.required]);
  LastName = new FormControl('', [Validators.required]);
  PersonalEmail = new FormControl('', [Validators.required, Validators.email]);
  ContactNo = new FormControl('', [Validators.required]);
  UserType = new FormControl('', [Validators.required]);
  Location = new FormControl('', [Validators.required]);
  userId!: string;
  data:any;

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
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public user: any
  ){
    this.data=user.user;
    this.userId=this.data.UserId;
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

      const CEmail=sessionStorage.getItem('companyEmail')

      const userData={
        userName:this.PersonalEmail.value, 
        firstName:this.FirstName.value, 
        lastName:this.LastName.value, 
        contact:this.ContactNo.value, 
        userType:this.UserType.value,
        location:this.Location.value,
        companyEmail:CEmail,
      }

      this.DashDataService.editUser(this.userId,userData).subscribe(
          () => {
          this.snackBar.open('User Data updated successfully!', 'Dismiss', {
            duration: 2000
          });
          this.dialogRef.close();
        },
        (error) => {
          this.snackBar.open('Failed to update user data. Please try again.',
            'Dismiss',
            { duration: 2000 }
          );
          this.dialogRef.close();
        }
      );
    }    
  }
}
