import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DashDataServiceService {

  public pageLoading = true;
  public dataLoading = true;
 

  constructor(private http: HttpClient, private router: Router) {}

  private readonly API_URL = 'http://43.204.234.201:4000';
  //private readonly API_URL = 'http://localhost:4000';

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

  deleteDevice(deviceID:string):Observable<any> {
    return this.http.delete(`${this.API_URL}/delete-Device/${deviceID}`);
  }

  editDevice(entryId:string,deviceData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/edit-Device/${entryId}`,deviceData);
  }

  editUser(UserId:string,userData:any):Observable<any> {
    return this.http.put(`${this.API_URL}/editUser/${UserId}`,userData);
  }

  analyticsDataByCustomForPieChart(deviceId: string, startDate: any, endDate: any): Observable<any> {
    const params = { start: startDate, end: endDate };
    return this.http.post(`${this.API_URL}/get-Analytics-Data-OnTime-Total-customs/${deviceId}`, params);
  }

  analyticsDataByIntervalForPieChart(deviceID: string | null, interval: any): Observable<any> {
    // Use the second argument to provide the query parameters
    return this.http.get(`${this.API_URL}/get-Analytics-Data-OnTime-Total-interval/${deviceID}/intervals?interval=${interval}`);
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
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Bar-Total-interval/${deviceID}/intervals?interval=${interval}`);
  }

  analyticsDataByCustomForBarChart(deviceId: string, startDate: any, endDate: any): Observable<any> {
    // Use the second argument to provide the query parameters
    const params = { start: startDate, end: endDate };
    return this.http.get(`${this.API_URL}/get-Analytics-Data-Bar-Total-Custom/${deviceId}`, { params });
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

  getDeviceData(CompanyEmail: string): Observable <any> {
    return this.http.get(`${this.API_URL}/getLatestEntry/${CompanyEmail}`);
  }

  public isPageLoading(isLoading: boolean) {
    this.pageLoading = isLoading;
  }
  public isDataLoading() {
    this.dataLoading = !this.dataLoading;
  }


}