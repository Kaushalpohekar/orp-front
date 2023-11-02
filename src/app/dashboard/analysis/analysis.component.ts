import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';

HighchartsMore(Highcharts);

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit{

  selectedValue!: string;

  dataStatus = [
    { status: 'online', percentage: 25.5 },
    { status: 'heating', percentage: 10.2 },
    { status: 'idle', percentage: 64.3 }
  ];

  ngOnInit() {
    this.createDonutChart(this.dataStatus);
    this.createBarChart();
    this.createLineChart();
  }

  createDonutChart(dataStatus: any) {
    const donutChartData = dataStatus.map((entry: any) => {
      const formattedPercentage = parseFloat(entry.percentage.toFixed(2)); // Format to two decimal places
      return {
        name: entry.status,
        y: formattedPercentage
      };
    });

    const options: Highcharts.Options = {
      chart: {
        type: 'pie'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        pie: {
          innerSize: '50%'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}%</b>'
      },
      series: [{
        type: 'pie',
        name: 'Status',
        data: donutChartData
      }]
    };

    Highcharts.chart('donutChart', options);
  }

  createBarChart() {
    const barChartData = [10, 20, 30, 40, 50]; // Replace with your own data

    const options: Highcharts.Options = {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        type: 'column', // Add the type property
        name: 'Bar Data',
        data: barChartData
      }]
    };

    Highcharts.chart('barChart', options);
  }

  createLineChart() {
    const lineChartData = [10, 15, 20, 25, 30, 12, 15, 20, 24, 25, 22 ]; // Replace with your own data

    const options: Highcharts.Options = {
      chart: {
        type: 'line'
      },
      title: {
        text: ''
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'june', 'july', 'aug', 'seept', 'oct', 'nov']
      },
      yAxis: {
        title: {
          text: 'Values'
        }
      },
      series: [{
        type: 'line', // Add the type property
        name: 'Line Data',
        data: lineChartData
      }]
    };

    Highcharts.chart('lineChart', options);
  }


}
