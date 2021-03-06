import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { itemSchema } from '../UIConfig.model';
import { LabelTypes } from '../enums';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent extends BaseComponent{
  labelConfig: itemSchema = new itemSchema();
  descriptionConfig: itemSchema = new itemSchema();
  tabs: Array<Object> = [];
  displayInOneLine = false;
  activeTabIndex: Number = 0; 

  ngOnInit() {
    super.ngOnInit();
    this.UpdateView();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  UpdateView() {
    if(this.compConfig.rendererProperties != undefined)
    {
      if(this.compConfig.rendererProperties.displayInOneLine == true)
      {
        this.displayInOneLine = true;
      }
      if (this.compConfig.rendererProperties.dynamicMode === true) {
        this.dynamicMode = true;
        this.tabs = this.builderModelSrvc.getStateRef(this.compConfig.rendererProperties.itemListRef);
      }
    }
    
    this.labelConfig.rendererProperties.text = this.compConfig.label;
    this.labelConfig.rendererProperties.type = LabelTypes.ELEMENT_HEADING;

    this.updateDescription();
  }
}
