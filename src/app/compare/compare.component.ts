import { DataService } from './../data.service';
import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';
import { FormControl, FormGroup, Validators } from '../../../node_modules/@angular/forms';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  @Input() stockName;
  chartReady: boolean = false;
  currentStockData: any[] = [];
  currentStock: any;
  filteredStockNames: Filter[] = [];
  filteredStocks: any[];
  selectedDuration: string;
  sector: string;
  allStocks: any[]= [];
  compareChartData: any[] = [];
  chartDataSource: any[] = [];
  stockDesc: StockDescription[]= [];
  timeFrame: any[] = [
    {
      name: '1d',
      value: '1 day'
    },
    {
      name: '1m',
      value: '1 month'
    },
    {
      name: '3m',
      value: '3 months'
    },
    {
      name: '6m',
      value: '6 months'
    },
    {
      name: '1y',
      value: '1 year'
    },
    {
      name: 'ytd',
      value: 'YTD'
    },
    {
      name: '2y',
      value: '2 years'
    },
    {
      name: '5y',
      value: '5 years'
    }
  ];
  
  stockForm = new FormGroup({
    stocks: new FormControl('',Validators.required),
    options: new FormControl('',Validators.required),
  });

  constructor(private service: DataService) { }

  ngOnInit() {
    this.getData();
    this.service.getAll().subscribe(response => {
      this.allStocks = Object.values(response);
      this.filterBySector(this.sector);
    })
  }

  getData(){
    this.service.getByName(this.stockName).subscribe(response => {
      this.currentStock = response;
      this.currentStockData = Object.values(this.currentStock);
      this.currentStockData.forEach(stock => {
        this.sector = stock.quote.sector;
      });
      //this.populateChartData(this.stockData);
    })
  }

  filterBySector(sector){
    for (let i = 0; i < this.allStocks.length; i++) {
      if(this.allStocks[i].quote.sector === sector && this.allStocks[i].quote.symbol.toLowerCase() !== this.stockName){
        this.filteredStockNames.push({
          sname: this.allStocks[i].quote.companyName,
          ticker: this.allStocks[i].quote.symbol.toLowerCase()
        })
      }
    }
    console.log(this.filteredStockNames);
  }

  onSubmit(){
    this.chartDataSource = [];
    this.filteredStocks = this.stockForm.controls.stocks.value;
    this.selectedDuration = this.stockForm.controls.options.value;
    //console.log(this.filteredStocks,this.selectedDuration);
    this.getFilteredChartData(this.filteredStocks,this.selectedDuration);
    this.chartReady = true;
  }

  getFilteredChartData(stocks, duration){
    this.stockDesc = [];
    this.compareChartData = [];
    for (let i = 0; i < stocks.length; i++) {
      this.stockDesc.push({
        name: stocks[i],
        value: stocks[i].toUpperCase()
      });
      this.service.getChart(stocks[i],duration).subscribe(response => {
        this.compareChartData.push(response);
        if( i === stocks.length-1)
          this.getChartData(this.compareChartData);
      })
    }
  }

  getChartData(data){
    var stock = data[0];
      for (let i = 0; i < stock.length; i++) {
        var temp1 = {
          date: stock[i].date,
        }
        temp1[this.stockDesc[0].name] = stock[i]['close'];
        for (let i = 1; i < data.length; i++) {
          temp1[this.stockDesc[i].name] = data[i].filter(function(e) {
            return e.date === temp1['date'];
          })[0]['close']
        }
        this.chartDataSource.push(temp1)
      }
      console.log(this.chartDataSource);
    }
}
export interface Filter{
  sname: string,
  ticker: string
}
export class StockDescription {
  value: string;
  name: string;
}
