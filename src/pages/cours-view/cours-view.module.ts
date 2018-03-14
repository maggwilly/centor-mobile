import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursViewPage } from './cours-view';
import { SharedDirectivesModule } from '../../app/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SharedProvidersModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    CoursViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursViewPage), SharedDirectivesModule, SharedProvidersModule
  ],
  providers: [InAppBrowser]
})
export class CoursViewPageModule {}
