import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatieresPage } from './matieres';
import { SharedComponentsModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    MatieresPage,
  ],
  imports: [
    IonicPageModule.forChild(MatieresPage),
    SharedComponentsModule
  ],
 
})
export class MatieresPageModule {}
