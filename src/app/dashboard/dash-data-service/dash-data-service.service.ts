import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashDataServiceService {

  constructor(private http: HttpClient, private router: Router) {}

  // private readonly API_URL = 'http://ec2-3-108-57-100.ap-south-1.compute.amazonaws.com:3000';
  private readonly API_URL = 'http://localhost:4000';

  userDetails(userData: any):Observable<any> {
    return this.http.get(`${this.API_URL}/fetchAllUsers`,userData);
  }

  deviceDetails(CompanyEmail: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getDeviceForUsers/${CompanyEmail}`);
  }

}
