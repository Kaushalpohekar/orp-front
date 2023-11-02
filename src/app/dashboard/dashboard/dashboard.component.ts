
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

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

  ngOnInit() {
    this.dataSource.sort = this.sort;
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
  // Add more data entries as needed
];