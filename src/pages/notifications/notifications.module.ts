import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationsPage } from './notifications';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    NotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationsPage), SharedDirectivesModule
  ],
})
export class NotificationsPageModule {}
