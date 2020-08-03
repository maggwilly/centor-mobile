import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareQuestionPage } from './share-question';
import { SharedDirectivesModule } from '../../app/shared.module';
import { SharedProvidersModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    ShareQuestionPage,

  ],
  imports: [
    IonicPageModule.forChild(ShareQuestionPage),
    SharedDirectivesModule,
    SharedProvidersModule
  ],

})
export class ShareQuestionPageModule {}
