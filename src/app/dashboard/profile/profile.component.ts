import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { AuthService } from 'src/app/login/auth/auth.service';
import { DataSource } from '@angular/cdk/collections';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit{
  constructor(
    private dashdataService:DashDataServiceService,private authService:AuthService,public snackBar: MatSnackBar
    ){

    }

  UserId!:string|null;
  fname!: string;
  lname!: string;
  companyEmail!: string;
  personalEmail!: string;
  companyName!: string;
  location!: string;
  designation!: string;
  contactNo!: string ;
  password: string = '';
  CPassword: string = ''; 
  hidePassword = true;
  hideConfirmPassword = true;
  cancelCompany: boolean = false;
  cancelPersonal: boolean = false;
  cancelPassword: boolean = false;
  dataSource:any;

  ngOnInit() {
    this.getUserDetail();
  }

  toggleCompany(){
    this.cancelCompany = !this.cancelCompany;
  }

  togglePersonal(){
    this.cancelPersonal = !this.cancelPersonal;
  }

  togglePassword(){
    this.cancelPassword = !this.cancelPassword;
  }

  updatePassword() {
  if (this.password !== this.CPassword) {
    this.snackBar.open('Passwords do not match!', 'Dismiss', {
      duration: 2000
      });
    return;
  }

  const passwordData = {
    password: this.password,
  };

  if (this.UserId) {
    this.dashdataService.updatePassword(this.UserId, passwordData).subscribe(
      () => {
        this.snackBar.open('Successfully updated password!', 'Dismiss', {
          duration: 2000
          });
        // Additional logic if needed
        this.getUserDetail();
        this.togglePassword();
      },
      (error) => {
        this.snackBar.open('Error updating password!', 'Dismiss', {
          duration: 2000
          });
      }
    );
  } else {
    this.snackBar.open('UserId is not available!', 'Dismiss', {
      duration: 2000
      });
  }
  }

  getUserDetail(){
    this.UserId = sessionStorage.getItem('UserId')
    console.log(this.UserId);

    if(this.UserId){
      this.dashdataService.getUserData(this.UserId).subscribe(
        (user) => {
          this.dataSource = user.getUserById;
          console.log(this.dataSource);
          this.fname = this.dataSource[0].FirstName;
          this.lname = this.dataSource[0].LastName;
          this.companyEmail = this.dataSource[0].CompanyEmail;
          this.personalEmail = this.dataSource[0].UserName;
          this.designation = this.dataSource[0].UserType;
          this.contactNo = this.dataSource[0].Contact;
          this.location = this.dataSource[0].Location;
          this.companyName = this.dataSource[0].CompanyName; 
        }
      )
    }
  }

  updatePersonal() {
    const PersonalData = {
      firstName : this.fname,
      lastName : this.lname
    }
    if (this.UserId) {
      this.dashdataService.updateCompanyDetails(this.UserId, PersonalData).subscribe(
        () => {
          this.snackBar.open('Successfully Updated!', 'Dismiss', {
            duration: 2000
            });
          this.getUserDetail();
          this.togglePersonal();
        },
        (error) => {
          this.snackBar.open('Error for getting details!', 'Dismiss', {
            duration: 2000
            });
        }
      );
    } else {
      this.snackBar.open('UserId is not available!', 'Dismiss', {
        duration: 2000
        });
    }
  }

  updateCompany() {
    const CompanyData = {
      contact : this.contactNo,
      location : this.location
    }
    if (this.UserId) {
      this.dashdataService.updateContactDetails(this.UserId, CompanyData).subscribe(
        () => {
          this.snackBar.open('Successfully Updated!', 'Dismiss', {
            duration: 2000
            });
          this.getUserDetail();
          this.toggleCompany();
        },
        (error) => {
          this.snackBar.open('Error for getting details!', 'Dismiss', {
            duration: 2000
            });
        }
      );
    } else {
      this.snackBar.open('UserId is not available!', 'Dismiss', {
        duration: 2000
        });
    }

  }
  
}
