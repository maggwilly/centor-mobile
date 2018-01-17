import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartPage } from './start';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    StartPage,
  ],
  imports: [
    IonicPageModule.forChild(StartPage),
  ],
  providers: [InAppBrowser]
})
export class StartPageModule {}
