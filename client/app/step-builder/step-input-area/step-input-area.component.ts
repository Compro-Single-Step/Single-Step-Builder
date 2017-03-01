import { Component, OnInit, Input } from '@angular/core';
import {UIConfig} from '../shared/UIConfig.model';

@Component({
  selector: 'app-step-input-area',
  templateUrl: './step-input-area.component.html',
  styleUrls: ['./step-input-area.component.css']
})
export class StepInputAreaComponent implements OnInit {
  private selectedView: number = 1;
  //TODO: type of stepConfig is to be defined as per model.
  @Input() stepConfig : UIConfig;
  constructor() {
  }

  ngOnInit() {
    console.log("ak91: input received - " + JSON.stringify(this.stepConfig));
  }
  
  getSelectedView() {
    return this.selectedView;
  }
}
