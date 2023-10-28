import { Component, OnInit } from '@angular/core';
import { Router,NavigationEnd  } from '@angular/router';

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
  constructor(private router: Router) 
  {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Extract the page name from the route URL
        this.currentPageName = this.getPageNameFromRoute(this.router.url);
      }
    });
  }


  ngOnInit(): void {
  }
  private getPageNameFromRoute(url: string): string {
    // You can implement your logic here to extract the page name
    // For example, if your routes are structured like '/dashboard', '/products', etc.
    // You can split the URL and take the last segment as the page name
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
