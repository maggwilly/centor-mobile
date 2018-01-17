import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ScorePage } from './score';
import { SharedComponentsModule } from '../../app/shared.module';
import { MathJaxDirective } from '../../directives/MathJax.directive';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
@NgModule({
  declarations: [
    ScorePage, 
    MathJaxDirective
  ],
  imports: [
    IonicPageModule.forChild(ScorePage), 
    SharedComponentsModule
  ],
  providers: [InAppBrowser, SocialSharing]
})
export class ScorePageModule {}
