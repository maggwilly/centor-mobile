import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StartPage } from './start';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    StartPage,
  ],
  imports: [
    IonicPageModule.forChild(StartPage),
    SharedDirectivesModule
  ],
})
export class StartPageModule {}
