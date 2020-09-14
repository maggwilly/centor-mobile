import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupsPage } from './groups';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    GroupsPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupsPage),
    SharedDirectivesModule

  ],
  exports: [
    GroupsPage
  ]
})
export class GroupsPageModule {}
