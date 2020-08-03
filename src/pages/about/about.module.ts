import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook'
import {SharedProvidersModule} from "../../app/shared.module";
@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage), SharedProvidersModule,
  ],
  providers: [InAppBrowser, Facebook]
})
export class AboutPageModule {}
