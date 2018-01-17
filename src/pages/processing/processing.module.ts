import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProcessingPage } from './processing';

@NgModule({
  declarations: [
    ProcessingPage,
  ],
  imports: [
    IonicPageModule.forChild(ProcessingPage),
  ],
})
export class ProcessingPageModule {}
