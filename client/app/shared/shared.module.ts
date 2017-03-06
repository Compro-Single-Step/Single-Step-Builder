import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Imports from External Libraries
import { TabsModule } from 'ng2-bootstrap';

//Importing the components available for dynamic insertion.
import { TextBoxComponent } from './text-box/text-box.component';
import { GroupComponent } from './group/group.component';
import { LabelComponent } from './label/label.component';
import { TagComponent } from './tag/tag.component';
import { SelectComponent } from './select/select.component';
import { TabComponent } from './tab/tab.component';
import { ButtonComponent } from './button/button.component';

import { InputFactoryService } from './input-factory.service';

@NgModule({
  imports: [
    CommonModule,
    TabsModule.forRoot()
  ],
  declarations: [TextBoxComponent, GroupComponent, LabelComponent, TagComponent, SelectComponent, TabComponent, ButtonComponent],
  entryComponents: [TextBoxComponent, GroupComponent, SelectComponent, TabComponent, ButtonComponent],
  providers: [InputFactoryService]
})
export class SharedModule { }
