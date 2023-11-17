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

  userDetails(CompanyEmail: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getUsersForUsers/${CompanyEmail}`);
  }

  deviceDetails(CompanyEmail: string):Observable<any> {
    return this.http.get(`${this.API_URL}/getDeviceForUsers/${CompanyEmail}`);
  }

  getUserData(UserId: string):Observable<any> {
    return this.http.get(`${this.API_URL}/fetchUserById/${UserId}`);
  }

  reportData(reportData: any):Observable<any> {
    return this.http.post(`${this.API_URL}/getReportData`, reportData);
  }

  addDevice(deviceData:any):Observable<any> {
    return this.http.post(`${this.API_URL}/add-Device`,deviceData);
  }

  addUser(userData:any):Observable<any> {
    return this.http.post(`${this.API_URL}/addUser`,userData);
  }

  deleteUser(userId:string):Observable<any> {
    return this.http.delete(`${this.API_URL}/deleteUser/${userId}`);
  }

  deleteDevice(entryId:string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete-Device/${entryId}`);
  }

  editDevice(entryId:string,deviceData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/edit-Device/${entryId}`,deviceData);
  }

  editUser(UserId:string,userData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/editUser/${UserId}`,userData);
  }

  analyticsDataByCustomForPieChart(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/get-Analytics-Data-OnTime-Total-customs`, data);
  }

  analyticsDataByIntervalForPieChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-OnTime-Total-interval/${deviceID}?interval=${interval}`);
  }

  analyticsDataByCustomForLineChart(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/get-Analytics-Data-Line-Total-customs`, data);
  }

  analyticsDataByIntervalForLineChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Line-Total-interval/${deviceID}?interval=${interval}`);
  }

  analyticsDataByIntervalForBarChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Bar-Total-interval/${deviceID}?interval=${interval}`);
  }

  analyticsDataByCustomForBarChart(data: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Bar-Total-Custom`, data);
  }

  updateCompanyDetails(UserId:string,companyData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateCompanyDetails/${UserId}`,companyData);
  }

  updatePassword(UserId:string,passwordData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/updatePassword/${UserId}`,passwordData);
  }

  updateContactDetails(UserId:string,contactData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/updateContactDetails/${UserId}`,contactData);
  }
}