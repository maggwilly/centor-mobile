import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScorePage } from './score';
import { SharedComponentsModule } from '../../app/shared.module';
import { SharedDirectivesModule } from '../../app/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
@NgModule({
  declarations: [
    ScorePage, 

  ],
  imports: [
    IonicPageModule.forChild(ScorePage), 
    SharedComponentsModule,
    SharedDirectivesModule
  ],
  providers: [InAppBrowser, SocialSharing]
})
export class ScorePageModule {}
