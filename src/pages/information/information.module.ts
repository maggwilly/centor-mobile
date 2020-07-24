import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InformationPage } from './information';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import '../../web-components/ck-component';
@NgModule({
  declarations: [
    InformationPage,
  ],
  imports: [
    IonicPageModule.forChild(InformationPage),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [InAppBrowser, SocialSharing]
})
export class InformationPageModule {}
