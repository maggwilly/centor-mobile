import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConcoursOptionsPage } from './concours-options';
import { DetailsComponent } from '../../components/details/details';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Facebook } from '@ionic-native/facebook'
import { SharedComponentsModule } from '../../app/shared.module';
import { SharedDirectivesModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    ConcoursOptionsPage, 
    DetailsComponent,
   
  ],
  imports: [
    IonicPageModule.forChild(ConcoursOptionsPage),
     SharedComponentsModule,
      SharedDirectivesModule
  ],
  entryComponents: [DetailsComponent],
  providers: [InAppBrowser, SocialSharing, Facebook]
})
export class ConcoursOptionsPageModule {}
