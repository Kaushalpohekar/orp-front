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
  private readonly API_URL = 'http://localhost:3000';

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

  getUserDetails(): void {
    const token = this.getToken();
    if (token) {
      this.http.get(`${this.API_URL}/fetchAllUsers`, { headers: { Authorization: `Bearer ${token}` } })
        .subscribe(
          (user: any) => {
            return user;
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
    this.isLoggedIn();
    this.router.navigate(['/login/login']);
  }
  
}
