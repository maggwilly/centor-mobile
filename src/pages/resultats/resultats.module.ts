import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ResultatsPage } from './resultats';
import { SharedDirectivesModule } from '../../app/shared.module';
import { SharedComponentsModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    ResultatsPage,
  ],
  imports: [
    IonicPageModule.forChild(ResultatsPage),
    SharedDirectivesModule,
    SharedComponentsModule
  ],
})
export class ResultatsPageModule {}
