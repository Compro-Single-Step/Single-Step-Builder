import { Component, OnInit, Input, ViewContainerRef, ViewChild } from '@angular/core';
import { InputFactoryService } from '../shared/input-factory.service';

@Component({
  selector: 'app-view-input-area',
  templateUrl: './view-input-area.component.html',
  styleUrls: ['./view-input-area.component.css']
})
export class ViewInputAreaComponent implements OnInit {
  @ViewChild('inputCompContainer', {read: ViewContainerRef}) compContainer;
  @Input() viewConfig: any;
  constructor(private factoryRef: InputFactoryService, vcref: ViewContainerRef) { }

  ngOnInit() {
    console.log("ak91: inside view input area before appending - " + JSON.stringify(this.viewConfig));
    //Initializing dynamic components based on the ui config json.
    for(let item of this.viewConfig.items){
      this.factoryRef.createComp(this.compContainer, item);
    }
  }
}