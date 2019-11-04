import { DataService } from './../data.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.css']
})
export class PerformanceComponent implements OnInit {

  @Input() stockName;
  financeData: any[] = [];
  constructor(private service: DataService) { }

  ngOnInit() {
    this.service.getFinancials(this.stockName).subscribe(response => {
      this.financeData = Object.values(response);
      console.log(this.financeData);
    })
  }

}
