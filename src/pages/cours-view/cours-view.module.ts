import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursViewPage } from './cours-view';
import { SharedDirectivesModule } from '../../app/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SharedProvidersModule } from '../../app/shared.module';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [
    CoursViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CoursViewPage),
     SharedDirectivesModule,
      SharedProvidersModule,
    Ionic2RatingModule
  ],
  providers: [InAppBrowser]
})
export class CoursViewPageModule {}
