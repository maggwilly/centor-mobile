import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingPage } from './setting';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    SettingPage,
  ],
  imports: [
    IonicPageModule.forChild(SettingPage),
    LazyLoadImageModule
  ],
})
export class SettingPageModule {}
