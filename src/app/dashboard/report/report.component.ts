import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { AuthService } from '../../login/auth/auth.service';
import { DashDataServiceService } from '../dash-data-service/dash-data-service.service';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import 'jspdf-autotable';
import { Subscription, interval, take } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  displayedColumns: string[] = ['Device', 'Date', 'Time', 'ORP', 'Pump1', 'Pump2'];
  dataSource = new MatTableDataSource<Devices>(ELEMENT_DATA);
  panelOpenState = false;
  first_device!:string;
  data:any
  intervalSubscription: Subscription | undefined;
  
  constructor(private snackBar: MatSnackBar, private authService: AuthService, private dashDataService: DashDataServiceService, private datePipe: DatePipe) {} 

  
  ngOnInit() {
    this.deviceList();
    this.startInterval();
  }

  device_uid = new FormControl('', [Validators.required]);
  start_date = new FormControl('', [Validators.required]);
  end_date = new FormControl('', [Validators.required]);

  id!: string|null;
  start!: string|null;
  end!: string|null;
  deviceStatus!: string;
  actualStatus!: string|null;

  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  dataSource2: any;
  currentDate: Date = new Date();
  startDate!: Date;
  endDate: Date = this.currentDate;

  ngOnDestroy() {
    this.stopInterval();
  }

  startInterval() {
    this.intervalSubscription = interval(1000)
      .pipe(take(Infinity))
      .subscribe(() => {
        this.defaultData();
      });
  }

  stopInterval() {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }
  
  defaultData(){    
    this.id = sessionStorage.getItem('defaultDevice');
    const s = sessionStorage.getItem('start_date');
    this.start = this.datePipe.transform(s, 'yyyy-MM-dd')??'';
    const e = sessionStorage.getItem('end_date');
    this.end = this.datePipe.transform(e, 'yyyy-MM-dd')??'';
    this.actualStatus= sessionStorage.getItem('DeviceStatus');
  }

  downloadCSV() {
    const csv = Papa.unparse(this.data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'report_data.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  downloadExcel() {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    this.saveAsExcelFile(excelBuffer, 'report_data.xlsx');
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    FileSaver.saveAs(data, fileName);
  }

  downloadPDF() {
    const jsPDF = require('jspdf');

    const columns = Object.keys(this.data[0]);
    const rows = this.data.map((item: Record<string, string | number>) => Object.values(item));

    const doc = new jsPDF.default(); // Use .default to access the class constructor

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save('report_data.pdf');
  }

  updateStartDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedStartDate = event.value;
    this.startDate = selectedStartDate;
  }

  updateEndDate(event: MatDatepickerInputEvent<any, any>): void {
    const selectedEndDate = event.value;
    if (!this.startDate || selectedEndDate >= this.startDate) {
      this.endDate = selectedEndDate;
    } else {
      this.endDate = this.currentDate;
      console.error('End date must be greater than or equal to the start date');
    }
  }

  select(deviceStat:any){
    this.deviceStatus=deviceStat.status;
  }

  deviceList() {
    const CompanyEmail = sessionStorage.getItem('companyEmail');
    if (CompanyEmail) {
      this.dashDataService.deviceDetails(CompanyEmail).subscribe(
        (device) => {
          this.dataSource2 = device.devices;
          this.first_device = this.dataSource2[0].device_uid;
          const first_status = this.dataSource2[0].status;
          const deviceId = sessionStorage.getItem('defaultDevice');
          if(deviceId === null){
            sessionStorage.setItem('defaultDevice',this.first_device);
            sessionStorage.setItem('DeviceStatus',first_status);
            this.setDefaultValue();
          }else{
            const reportData = {
              device_uid: sessionStorage.getItem('defaultDevice'),
              start_time: sessionStorage.getItem('start_date'),
              end_time: sessionStorage.getItem('end_date'),
            }
        
            this.dashDataService.reportData(reportData).subscribe(
              (data) => {
                
                data.data.forEach((item: Devices) => {
                  const parsedDate = new Date(item.date_time);
                  item.date = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
                  item.time = this.datePipe.transform(parsedDate, 'HH:mm:ss');
                });

                this.dataSource.data = data.data;
                this.data = data.data;
                this.dataSource.paginator = this.paginator;
              },
              (error) => {
                this.snackBar.open('Error while getting Data!', 'Dismiss', {
                  duration: 2000
                  });
              }
            );
          }       
        },
        (error) => {
          this.snackBar.open('Error while fetching devices Data!', 'Dismiss', {
            duration: 2000
            });
        }
      );
    }
  }

  setDefaultValue(){
    const previousDate = new Date(this.currentDate);
      previousDate.setDate(this.currentDate.getDate() - 1);
      const formattedStartDate = this.datePipe.transform(previousDate, 'yyyy-MM-dd HH:mm:ss')??'';
    sessionStorage.setItem('start_date',formattedStartDate)

      const formattedEndDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd HH:mm:ss')??'';
    sessionStorage.setItem('end_date',formattedEndDate)

    const reportData = {
      device_uid: sessionStorage.getItem('defaultDevice'),
      start_time: sessionStorage.getItem('start_date'),
      end_time: sessionStorage.getItem('end_date'),
    }

    this.dashDataService.reportData(reportData).subscribe(
      (data) => {
        data.data.forEach((item: Devices) => {
          const parsedDate = new Date(item.date_time);
          item.date = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
          item.time = this.datePipe.transform(parsedDate, 'HH:mm:ss');
        });
        
        this.dataSource.data = data.data;
        this.data = data.data;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        this.snackBar.open('Error while getting Data!', 'Dismiss', {
          duration: 2000
        });
      }
    );
  }

  applyFilter() {
    if (this.device_uid.valid && this.start_date.valid && this.end_date.valid) {
      const formattedStartDate = this.datePipe.transform(this.start_date.value, 'yyyy-MM-dd HH:mm:ss')??'';
      const formattedEndDate = this.datePipe.transform(this.end_date.value, 'yyyy-MM-dd HH:mm:ss')??'';

      
      const new_uid= this.device_uid.value??'';
      sessionStorage.setItem('defaultDevice',new_uid);
      sessionStorage.setItem('start_date',formattedStartDate);
      sessionStorage.setItem('end_date',formattedEndDate);
      sessionStorage.setItem('DeviceStatus',this.deviceStatus);

      const reportData = {
        device_uid: sessionStorage.getItem('defaultDevice'),
        start_time: sessionStorage.getItem('start_date'),
        end_time: sessionStorage.getItem('end_date'),
      }

      this.dashDataService.reportData(reportData).subscribe(
        (data) => {

          data.data.forEach((item: Devices) => {
            const parsedDate = new Date(item.date_time);
            item.date = this.datePipe.transform(parsedDate, 'yyyy-MM-dd');
            item.time = this.datePipe.transform(parsedDate, 'HH:mm:ss');
          });

          this.dataSource.data = data.data;
          this.data = data.data;
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.snackBar.open('Error while getting Data!', 'Dismiss', {
            duration: 2000
            });
        }
      );
    } else {
      this.snackBar.open('Please select fields!', 'Dismiss', {
        duration: 2000
      });
    }
  }
}

export interface Devices {
  device_name: string;
  pump1: string;
  pump2: string;
  Location: string;
  device_latitude: number;
  device_longitude: number;
  date: string | null;
  time: string | null;
  date_time: string;
}

const ELEMENT_DATA: Devices[] = [];
