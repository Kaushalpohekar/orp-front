import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as L from 'leaflet';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  displayedColumns: string[] = ['name', 'age', 'city', 'Date'];
  dataSource = new MatTableDataSource<Person>(ELEMENT_DATA);
  panelOpenState = false;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('mapContainer')
  mapContainer!: ElementRef;

  private Highcharts: typeof Highcharts = Highcharts;
  constructor(private el: ElementRef) {}
  

   ngOnInit() {
    this.dataSource.sort = this.sort;
    this.indiamap();
    }

    indiamap(){
      const map = L.map('india-map').setView([20.5937, 78.9629], 5);

    // Add a tile layer (you can use your preferred map provider)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

    // Add a marker for Delhi
    L.marker([28.6139, 77.2090]).addTo(map)
      .bindPopup('Delhi, India')
      .openPopup();
    }
  }


export interface Person {
  name: string;
  age: number;
  city: string;
  Date: string;
}

const ELEMENT_DATA: Person[] = [
  { name: 'Alice', age: 28, city: 'New York', Date: "10-20-2023" },
  { name: 'Bob', age: 22, city: 'Los Angeles', Date: "10-20-2023" }
];
