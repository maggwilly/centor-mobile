import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NoclassPage } from './noclass';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    NoclassPage,
  ],
  imports: [
    IonicPageModule.forChild(NoclassPage),
  ],
  providers: [InAppBrowser]
})
export class NoclassPageModule {}
