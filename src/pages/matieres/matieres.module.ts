import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MatieresPage } from './matieres';
import { SharedComponentsModule } from '../../app/shared.module';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    MatieresPage,
  ],
  imports: [
    IonicPageModule.forChild(MatieresPage),
    SharedComponentsModule, SharedDirectivesModule
  ],
 
})
export class MatieresPageModule {}
