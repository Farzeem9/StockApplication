import { DataService } from './../data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  watchlist: any[];
  stockNames: string[] = [];
  gridData: any[];
  constructor(private service: DataService, private router: Router) { }

  ngOnInit() {
    this.watchlist = this.service.getWatchList();
    this.getStockNames();
    this.getGrdiData();
    this.refreshData();
  }

  getStockNames(){
    for (let i = 0; i < this.watchlist.length; i++) {
      this.stockNames.push(this.watchlist[i].name);
    }
  }

  getGrdiData(){
    this.service.getQuotes(this.stockNames).subscribe(response => {
      this.gridData = Object.values(response);
    })
  }

  refreshData(){
    setInterval(() => {
      this.getGrdiData();
    },5000)
  }

  onClick(event){
    let stockName: string = event.data.quote.symbol;
    this.router.navigate(['/stock/'+stockName.toLowerCase()])
  }
}
