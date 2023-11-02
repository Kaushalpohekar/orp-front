import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HC_map from 'highcharts/modules/map';
HC_map(Highcharts);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent  implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.createMapChart();
  }

  createMapChart(): void {
    Highcharts.mapChart('india-map', {
      chart: {
        map: 'countries/in/in-all'
      },
      title: {
        text: 'India Map with Markers'
      },
      series: [{
        name: 'Cities',
        type: 'mappoint',
        color: 'red',
        data: [{
          name: 'Delhi',
          lat: 28.6139,
          lon: 77.2090
        }, {
          name: 'Mumbai',
          lat: 19.0760,
          lon: 72.8777
        }, {
          name: 'Kolkata',
          lat: 22.5726,
          lon: 88.3639
        }, {
          name: 'Chennai',
          lat: 13.0827,
          lon: 80.2707
        }]
      }]
    });
  }
}
