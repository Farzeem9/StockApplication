import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '../../../node_modules/@angular/router';

@Component({
  selector: 'chart-component',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {

  @Input() source;
  @Input() symbol;
  sname: string;
  constructor() { }

  ngOnInit() {
    console.log(this.symbol);
  }

}
