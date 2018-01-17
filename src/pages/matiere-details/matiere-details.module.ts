import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatiereDetailsPage } from './matiere-details';
import { SharedComponentsModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    MatiereDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(MatiereDetailsPage), 
    SharedComponentsModule
  ],
})
export class MatiereDetailsPageModule {}
