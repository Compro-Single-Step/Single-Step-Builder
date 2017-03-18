import { NgModule }      from '@angular/core';
import { CommonModule }  from '@angular/common';

import { RouterModule } from '@angular/router';

import { TaskBuilderComponent } from './task-builder.component';
import { TaskstepComponent } from './taskstep/taskstep.component';
import { DataService } from './shared/data.service';
import { TaskDataResolver } from '../task-builder/shared/dataservice-resolver.service' 

const routes = [
  { path: '', component: TaskBuilderComponent, pathMatch: 'full',resolve: {
      taskData: TaskDataResolver
    } }
];


@NgModule({
  imports: [ CommonModule, RouterModule.forChild(routes)],
  declarations: [ TaskBuilderComponent, TaskstepComponent],
  providers: [DataService, TaskDataResolver]
})
export class TaskBuilderModule {
}