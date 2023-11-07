import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token!: string | null;

  constructor(private http: HttpClient, private router: Router) {}
  private readonly API_URL = 'http://localhost:4000';

  login(loginData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, loginData);
  }
  
  getToken(): string | null {
    return this.token || sessionStorage.getItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    sessionStorage.setItem('token', token); // Store the token in the session storage

    // Fetch user details immediately after setting the token
    this.getUserDetails();
  }

  setUserType(userType: string) {
    sessionStorage.setItem('userType', userType);
  }

  getUserType(): string | null {
    return sessionStorage.getItem('userType');
  }

  setUserId(UserId: string){
    sessionStorage.setItem('UserId', UserId);
  }

  getUserId(): string | null {
    return sessionStorage.getItem('UserId');
  }

  setCompanyEmail(companyEmail: string){
    sessionStorage.setItem('companyEmail', companyEmail);
  }

  getCompanyEmail(): string | null {
    return sessionStorage.getItem('companyEmail');
  }

  setCompanyName(companyName: string){
    sessionStorage.setItem('companyName', companyName);
  }

  getCompanyName(): string | null {
    return sessionStorage.getItem('companyName');
  }

  getUserDetails(): void {
    const token = this.getToken();
    if (token) {
      this.http.get(`${this.API_URL}/user`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe(
          (user: any) => {
            const dataSource=user.user[0];
            const userType = dataSource.UserType;
            this.setUserType(userType);

            const UserId = dataSource.UserId;
            this.setUserId(UserId);

            const companyEmail = dataSource.CompanyEmail;
            this.setCompanyEmail(companyEmail);

            const companyName = dataSource.CompanyName;
            this.setCompanyName(companyName);
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('CompanyEmail');
    this.isLoggedIn();
    this.router.navigate(['/login/login']);
  }
}
