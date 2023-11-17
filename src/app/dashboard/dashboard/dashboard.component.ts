import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as L from 'leaflet';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['DeviceName', 'Pump 1', 'Pump 2', 'Location'];
  dataSource = new MatTableDataSource<Device>(ELEMENT_DATA);
  panelOpenState = false;
  CompanyEmail!: string;
  devices!: any[];
  mqttSubscriptions: Subscription[] = [];
  deviceData: any[] = [];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private Highcharts: typeof Highcharts = Highcharts;

  constructor(private mqttService: MqttService, private el: ElementRef, private authService: AuthService, private dashDataService: DashDataServiceService) {}

  ngOnInit() {
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.dataSource.sort = this.sort;
    this.deviceList();
  }

  ngOnDestroy() {
    this.unsubscribeFromTopics();
  }

  subscribeToTopics() {
    this.deviceData = [];
    this.devices.forEach(device => {
      const topic = `EnergyCoilStatus/SenseLive/${device.device_uid}/1`;
      const subscription = this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
        const payload = message.payload.toString();
        const deviceData = JSON.parse(payload);
        console.log(deviceData);
        const index = this.devices.findIndex(d => d.device_uid === device.device_uid);
        if (index !== -1) {
          this.deviceData[index] = deviceData;
        }
      });

      this.mqttSubscriptions.push(subscription);
    });
  }

  getIndex(device_uid: string): number {
    return this.devices.findIndex(device => device.device_uid === device_uid);
  }

  unsubscribeFromTopics() {
    this.mqttSubscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.mqttSubscriptions = [];
  }

  deviceList(){
    if(this.CompanyEmail){
      this.dashDataService.deviceDetails(this.CompanyEmail).subscribe(
        (device) => {
          this.dataSource = device.devices;
          this.devices = device.devices;
          this.indiamap(this.devices);
          this.subscribeToTopics();
        },
        (error) => {
          console.log("Error while fetchingg tthee device List");
        }
      );
    }
  }

  indiamap(devices: Device[]) {
    const map = L.map('india-map',{attributionControl: false}).setView([20.5937, 78.9629], 5);

    // Add a tile layer (you can use your preferred map provider)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(map);

      devices.forEach(device => {
        const customIcon = L.icon({
          iconUrl: 'assets/img/icons8-factory-64.png', // Adjust the path accordingly
          iconSize: [32, 32], // Width and height of the icon
        });

        const { device_latitude, device_longitute, device_name, Location } = device;
        console.log(device);

        const marker = L.marker([device_latitude, device_longitute], { icon: customIcon }).addTo(map);
        marker.bindPopup(`${device_name}, ${Location}`);
      });
  }
}

export interface Device {
  device_name: string;
  pump1: string;
  pump2: string;
  Location: string;
  device_latitude: number;
  device_longitute: number;
}

const ELEMENT_DATA: Device[] = [];
