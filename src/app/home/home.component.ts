import { map } from "rxjs/operators";
import { DataService } from "./../data.service";
import { Component, OnInit } from "@angular/core";
import { Router } from "../../../node_modules/@angular/router";
import { Time } from "../../../node_modules/@angular/common";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit {
  stocks: object = {};
  grid: any;
  gridData: any;
  stockData: any[];
  data: Data;
  stockName: string;
  watchList: any[];
  icon: string;
  isAdded: boolean;
  isCollapsed: boolean;
  constructor(private service: DataService, private router: Router) {}

  ngOnInit() {
    //this.loading = false;
    this.checkIfCollapsed();
    this.populateGridData();
    this.watchList = this.service.getWatchList();
    var isBookmarked = this.checkIfAdded();
    this.icon = isBookmarked === true ? "bookmark" : "bookmark_border";
    this.refreshData();
  }

  populateGridData() {
    //this.loading = true;
    this.service.getAll().subscribe(response => {
      //this.stocks = response;
      //this.getGridData(this.stocks);
      this.gridData = response;
    });
  }

  refreshData() {
    setInterval(() => {
      //this.populateGridData();
      this.checkIfCollapsed();
    }, 0);
  }

  // contentReady($event) {
  //this.loading = false;
  // }

  getGridData(stocks) {
    this.gridData = [];
    this.stockData = Object.values(stocks);
    for (let i = 0; i < this.stockData.length; i++) {
      this.data = {
        symbol: this.stockData[i].quote.symbol,
        primaryExchange: this.stockData[i].quote.primaryExchange,
        high: this.stockData[i].quote.high,
        low: this.stockData[i].quote.low,
        companyName: this.stockData[i].quote.companyName,
        sector: this.stockData[i].quote.sector,
        open: this.stockData[i].quote.open,
        close: this.stockData[i].quote.close,
        change: this.stockData[i].quote.change,
        changePercent: this.stockData[i].quote.changePercent,
        avgTotalVolume: this.stockData[i].quote.avgTotalVolume,
        marketCap: this.stockData[i].quote.marketCap,
        peRatio: this.stockData[i].quote.peRatio,
        latestTime: this.stockData[i].quote.latestTime
      };
      this.gridData.push(this.data);
    }
  }

  onClick() {
    this.router.navigate(["/stock/" + this.stockName.toLowerCase()]);
  }

  // onContextMenuPreparing(event) {
  //   alert('right click');
  // }

  updateWatchList() {
    if (this.isAdded) {
      //remove
      for (let i = 0; i < this.watchList.length; i++) {
        if (this.watchList[i].name === this.stockName) {
          this.watchList.splice(i, 1);
        }
      }
      //this.message = 'Removed from WatchList'
      this.icon = "bookmark_border";
      this.isAdded = false;
    } else {
      //add
      this.watchList.push({
        name: this.stockName,
        isActive: true
      });
      //this.message = 'Added to WatchList'
      this.icon = "bookmark";
      this.isAdded = true;
    }
    console.log(this.watchList);
    localStorage.setItem("watchlist", JSON.stringify(this.watchList));
  }

  checkIfAdded(): boolean {
    for (let i = 0; i < this.watchList.length; i++) {
      if (
        this.watchList[i].name === this.stockName &&
        this.watchList[i].isActive
      ) {
        this.isAdded = true;
      }
    }
    return this.isAdded;
  }

  iconClick(event) {
    this.stockName = event.values[1].toLowerCase();
  }

  checkIfCollapsed() {
    this.isCollapsed = JSON.parse(localStorage.getItem("collapse"));
  }
}

export class Data {
  symbol: string;
  primaryExchange: string;
  high: number;
  low: number;
  companyName: string;
  sector: string;
  open: number;
  close: number;
  change: number;
  changePercent: number;
  avgTotalVolume: number;
  marketCap: number;
  peRatio: number;
  latestTime: Time;
}
