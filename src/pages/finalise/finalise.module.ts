import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinalisePage } from './finalise';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    FinalisePage,
  ],
  imports: [
    IonicPageModule.forChild(FinalisePage),
  ],
  providers: [InAppBrowser]
})
export class FinalisePageModule {}
