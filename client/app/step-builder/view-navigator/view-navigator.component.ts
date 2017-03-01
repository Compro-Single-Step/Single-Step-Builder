import { Component, OnInit, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'app-view-navigator',
  templateUrl: './view-navigator.component.html',
  styleUrls: ['./view-navigator.component.css']
})
export class ViewNavigatorComponent implements OnInit, OnChanges {

  @Input() views: number;

  constructor() { }

  ngOnInit() {
    console.log("ak91: inside view navigator - " + this.views);
  }

  ngOnChanges(){
    console.log("ak91: inside view navigator - " + this.views);
  }

}