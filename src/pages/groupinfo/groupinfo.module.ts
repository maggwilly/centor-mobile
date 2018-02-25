import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupinfoPage } from './groupinfo';
import { SharedProvidersModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    GroupinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupinfoPage),
    SharedProvidersModule
  ],
  exports: [
    GroupinfoPage
  ]
})
export class GroupinfoPageModule {}
