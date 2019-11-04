import { DataService } from "./../data.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "../../../node_modules/@angular/router";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-stock-details",
  templateUrl: "./stock-details.component.html",
  styleUrls: ["./stock-details.component.css"]
})
export class StockDetailsComponent implements OnInit {
  stock: object = {};
  stockData: any[] = [];
  chartData: any[];
  tradeData: any;
  stockName: string;
  message: string;
  action: string = "Close";
  duration: string = "1d";
  logo: any;
  image: any;
  performanceTab: boolean;
  isAdded: boolean;
  isCollapsed: boolean;
  watchList: any[] = [];
  icon: string;
  buttons: any[] = [
    {
      name: "1d",
      value: "1 day"
    },
    {
      name: "1m",
      value: "1 month"
    },
    {
      name: "3m",
      value: "3 months"
    },
    {
      name: "6m",
      value: "6 months"
    },
    {
      name: "1y",
      value: "1 year"
    },
    {
      name: "ytd",
      value: "YTD"
    },
    {
      name: "2y",
      value: "2 years"
    },
    {
      name: "5y",
      value: "5 years"
    }
  ];
  constructor(
    private service: DataService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.stockName = this.route.snapshot.paramMap.get("sname");
    if (localStorage.getItem("watchlist") !== null)
      this.watchList = JSON.parse(localStorage.getItem("watchlist"));
    else localStorage.setItem("watchlist", JSON.stringify([]));
    this.getData();
    this.getLogo();
    this.populateCharts();
    this.getLargestTrades();
    var isBookmarked = this.checkIfAdded();
    this.icon = isBookmarked === true ? "bookmark" : "bookmark_border";
    this.refreshMenu();
    this.refreshData();
  }

  getData() {
    this.service.getByName(this.stockName).subscribe(response => {
      this.stock = response;
      this.stockData = Object.values(this.stock);
      //this.populateChartData(this.stockData);
    });
  }

  refreshData() {
    setInterval(() => {
      this.getData();
      this.populateCharts();
    }, 5000);
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

  getLogo() {
    this.service.getLogo(this.stockName).subscribe(response => {
      this.logo = response;
    });
  }

  customizeTooltip(arg) {
    return {
      text:
        "Open: $" +
        arg.openValue +
        "<br/>" +
        "Close: $" +
        arg.closeValue +
        "<br/>" +
        "High: $" +
        arg.highValue +
        "<br/>" +
        "Low: $" +
        arg.lowValue +
        "<br/>"
    };
  }

  // populateChartData(stockData){
  //   stockData.forEach(stock => {
  //     for (let i = 0; i < stock.chart.length; i++) {
  //       this.chartData.push(stock.chart[i]);
  //     }
  //   });
  // }

  populateCharts() {
    this.service.getChart(this.stockName, this.duration).subscribe(response => {
      this.chartData = Object.values(response);
    });
  }

  onClick(event) {
    this.duration = this.buttons[event.index].name;
    this.populateCharts();
  }

  backToHome() {
    this.router.navigate([""]);
  }

  onFocusChange(event) {
    this.performanceTab = false;
    if (event.index === 3) {
      setTimeout(() => {
        this.performanceTab = true;
      }, 0);
    }
  }

  getLargestTrades() {
    this.service.getLargestTrades(this.stockName).subscribe(response => {
      this.tradeData = response;
    });
  }

  addToWatchList() {
    //logic to add or remove stock
    if (this.isAdded) {
      //remove
      for (let i = 0; i < this.watchList.length; i++) {
        if (this.watchList[i].name === this.stockName) {
          this.watchList.splice(i, 1);
        }
      }
      this.message = "Removed from WatchList";
      this.icon = "bookmark_border";
      this.isAdded = false;
    } else {
      //add
      this.watchList.push({
        name: this.stockName,
        isActive: true
      });
      this.message = "Added to WatchList";
      this.icon = "bookmark";
      this.isAdded = true;
    }
    console.log(this.watchList);
    localStorage.setItem("watchlist", JSON.stringify(this.watchList));
  }

  openSnackBar() {
    this.snackBar.open(this.message, this.action, {
      duration: 3000
    });
  }

  refreshMenu() {
    setTimeout(() => {
      this.checkIfCollapsed();
    }, 0);
  }

  checkIfCollapsed() {
    this.isCollapsed = JSON.parse(localStorage.getItem("collapse"));
  }
}
