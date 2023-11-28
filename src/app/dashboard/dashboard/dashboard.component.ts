import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import * as Highcharts from 'highcharts';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as L from 'leaflet';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['DeviceName', 'ORP', 'Pump 1', 'Pump 2', 'Location'];
  dataSource = new MatTableDataSource<Device>(ELEMENT_DATA);
  panelOpenState = false;
  CompanyEmail!: string;
  devices!: any[];
  mqttSubscriptions: Subscription[] = [];
  deviceData: any[] = [];

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  private Highcharts: typeof Highcharts = Highcharts;

  constructor(private mqttService: MqttService, private el: ElementRef, private authService: AuthService, private dashDataService: DashDataServiceService,public snackBar:MatSnackBar) {}

  ngOnInit() {
    this.CompanyEmail = this.authService.getCompanyEmail() ?? '';
    this.dataSource.sort = this.sort;
    this.deviceList();
  }

  ngOnDestroy() {
    this.unsubscribeFromTopics();
  }

  // subscribeToTopics() {
  //   this.deviceData = [];
  //   this.devices.forEach(device => {
  //     const topic = `Sense/Live/coil/${device.device_uid}`;
  //     const subscription = this.mqttService.observe(topic).subscribe((message: IMqttMessage) => {
  //       const payload = message.payload.toString();
  //       const deviceData = JSON.parse(payload);
  //       const index = this.devices.findIndex(d => d.device_uid === device.device_uid);
  //       if (index !== -1) {
  //         this.deviceData[index] = deviceData;
  //       }
  //     });

  //     this.mqttSubscriptions.push(subscription);
  //   });
  // }

  subscribeToTopics() {
  this.deviceData = [];

  this.devices.forEach(device => {
    const coilTopic = `Sense/Live/coil/${device.device_uid}`;
    const orpTopic = `Sense/Live/ORP/${device.device_uid}`;

    const coilSubscription = this.mqttService.observe(coilTopic).subscribe((coilMessage: IMqttMessage) => {
      const coilPayload = JSON.parse(coilMessage.payload.toString());
      console.log(coilPayload);
      this.processMqttPayload(device, coilPayload);
    });

    const orpSubscription = this.mqttService.observe(orpTopic).subscribe((orpMessage: IMqttMessage) => {
      const orpPayload = JSON.parse(orpMessage.payload.toString());
      console.log(orpPayload);
      this.processMqttPayload(device, orpPayload);
    });

    this.mqttSubscriptions.push(coilSubscription, orpSubscription);
  });
}

private processMqttPayload(device: any, payload: any): void {
  const index = this.devices.findIndex(d => d.device_uid === device.device_uid);

  if (index !== -1) {
    // If deviceData for this index doesn't exist yet, initialize it as an empty object
    this.deviceData[index] = this.deviceData[index] || {};

    // Merge the payload into the existing deviceData
    Object.assign(this.deviceData[index], payload);

    // Optionally, you can also include the device_uid in the merged data
    this.deviceData[index]['device_uid'] = device.device_uid;
  }
  console.log(this.deviceData);
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
          this.snackBar.open('Error while fetching devices data!', 'Dismiss', {
            duration: 2000
            });
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
  ORP: number;
}

const ELEMENT_DATA: Device[] = [];
