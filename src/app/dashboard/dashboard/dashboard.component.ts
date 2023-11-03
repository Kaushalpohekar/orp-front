import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsOfflineExporting from 'highcharts/modules/offline-exporting';
import HighchartsMap from 'highcharts/modules/map';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

HighchartsExporting(Highcharts);
HighchartsOfflineExporting(Highcharts);
HighchartsMap(Highcharts);


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
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
    this.initializeMapChart();
    }
    private async initializeMapChart() {
      const topology = await fetch('https://code.highcharts.com/mapdata/custom/europe.topo.json'
      ).then((response) => response.json());
  
      const chartOptions: Highcharts.Options = {
        chart: {
          renderTo: this.el.nativeElement.querySelector('#container'),
          map: topology,
          margin: 1,
        },
        title: {
          text: 'Categories of European capitals',
          floating: true,
          style: {
            textOutline: '5px contrast',
          },
        },
        subtitle: {
          text: 'Map markers in Highcharts',
          floating: true,
          y: 36,
          style: {
            textOutline: '5px contrast',
          },
        },
        mapNavigation: {
          enabled: true,
          buttonOptions: {
            alignTo: 'spacingBox',
            verticalAlign: 'bottom',
          },
        },
        mapView: {
          padding: [0, 0, 85, 0],
        },
        legend: {
          floating: true,
          backgroundColor: '#ffffffcc',
        },
        plotOptions: {
          mappoint: {
            keys: ['id', 'lat', 'lon', 'name', 'y'],
            marker: {
              lineWidth: 1,
              lineColor: '#000',
              symbol: 'mapmarker',
              radius: 8,
            },
            dataLabels: {
              enabled: false,
            },
          },
        },
        tooltip: {
          headerFormat:
            '<span style="color:{point.color}">\u25CF</span> {point.key}<br/>',
          pointFormat: '{series.name}',
        },
        series: [
          {
            allAreas: true,
            name: 'Coastline',
            states: {
              inactive: {
                opacity: 0.2,
              },
            },
            dataLabels: {
              enabled: false,
            },
            enableMouseTracking: false,
            showInLegend: false,
            borderColor: 'blue',
            opacity: 0.3,
            borderWidth: 10,
          },
          {
            allAreas: true,
            name: 'Countries',
            states: {
              inactive: {
                opacity: 1,
              },
            },
            dataLabels: {
              enabled: false,
            },
            enableMouseTracking: false,
            showInLegend: false,
            borderColor: 'rgba(0, 0, 0, 0.25)',
          },
          {
            name: 'Coastal',
            color: 'rgb(124, 181, 236)',
            data: [
              ['is', 64.15, -21.95, 'Reykjavik', -6],
              ['fo', 62, -6.79, 'Torshavn', 1],
              // Add more data points here
            ],
            type: 'mappoint',
          },
          {
            name: 'Landlocked',
            color: 'rgb(241, 92, 128)',
            data: [
              ['ru', 55.75, 37.6, 'Moscow', -5],
              ['lt', 54.68, 25.31, 'Vilnius', -3],
              // Add more data points here
            ],
            type: 'mappoint',
          },
        ]as any,
      }as Highcharts.Options;
      Highcharts.mapChart(chartOptions);
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
