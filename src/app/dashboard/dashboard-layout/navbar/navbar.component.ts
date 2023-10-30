import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';
import { AuthService } from 'src/app/login/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{

  

  currentPageName: string = '';
  isFullScreen = false;
  elem = document.documentElement;
  isFullscreen = false;
  constructor(public authService:  AuthService,private router: Router) 
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentPageName = this.getPageNameFromRoute(this.router.url);
      }
    });
  }

  logout(){
    this.authService.logout();
    window.location.reload();
  }

  ngOnInit(): void {

  }

  private getPageNameFromRoute(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }

  toggleFullScreen() {
    if (!this.isFullScreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.isFullScreen = true;
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        this.isFullScreen = false;
      }
    }
  }

}
