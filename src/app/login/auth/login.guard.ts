// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { Observable } from 'rxjs';
// import { AuthService } from '../auth/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class LoginGuard implements CanActivate {

//   constructor(private authService: AuthService, private router: Router) {}


//   canActivate(): boolean {
//     if (this.authService.isLoggedIn()) {
//       const Designation = this.authService.getDesignation();
//       if (Designation === 'Intern' || Designation === 'Employee') {
//         this.router.navigate(['/dashboard']);
//       } else if (Designation === 'Super Employee') {
//         this.router.navigate(['/sa']);
//       }
//       return false;
//     }

//     return true;
//   }
  
// }