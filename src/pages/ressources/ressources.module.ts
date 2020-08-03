import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RessourcesPage } from './ressources';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    RessourcesPage,
  ],
  imports: [
    IonicPageModule.forChild(RessourcesPage),
    SharedDirectivesModule
  ],
})
export class RessourcesPageModule {}
