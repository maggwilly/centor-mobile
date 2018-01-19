import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AboutPage } from './about';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Facebook } from '@ionic-native/facebook'
@NgModule({
  declarations: [
    AboutPage,
  ],
  imports: [
    IonicPageModule.forChild(AboutPage),
  ],
  providers: [InAppBrowser, Facebook]
})
export class AboutPageModule {}
