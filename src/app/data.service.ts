import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '../../node_modules/@angular/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from '../../node_modules/rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //private url: string =  'https://api.iextrading.com/1.0/stock/market/batch?symbols=aapl,fb,infy,csco,ebay,orcl,t,jpm,twtr,qcom,goog,mlhr,abt,anf,nke,intc,amzn,hpq&types=quote,news,chart&range=1m&last=5';
  private url: string = 'https://api.iextrading.com/1.0/ref-data/symbols'
  private commonUrl: string = 'https://api.iextrading.com/1.0/stock/market/batch?';
  private apiUrl: string = 'https://api.iextrading.com/1.0/stock/';
  constructor(private http: HttpClient) { }

  getAll(){
    return this.http.get(this.url)
  }

  getByName(sname){
    return this.http.get(this.commonUrl+'symbols='+sname+'&types=quote,news,chart&range=1m&last=5')
  }

  getChart(sname: string, duration: string){
    return this.http.get(this.apiUrl+sname+'/chart/'+duration)
  }

  getLogo(sname: string){
    return this.http.get(this.apiUrl+sname+'/logo')
  }

  getFinancials(sname: string){
    return this.http.get(this.apiUrl+sname+'/financials')
  }

  getLargestTrades(sname: string){
    return this.http.get(this.apiUrl+sname+'/largest-trades')
  }

  getQuotes(stocks: string[]){
    return this.http.get(this.commonUrl+'symbols='+stocks.toString()+'&types=quote')
  }

  getWatchList(){
    return JSON.parse(localStorage.getItem('watchlist'))
  }
}
