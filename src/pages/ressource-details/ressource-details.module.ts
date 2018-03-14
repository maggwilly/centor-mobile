import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RessourceDetailsPage } from './ressource-details';
import { SharedDirectivesModule } from '../../app/shared.module';
import { SharedProvidersModule } from '../../app/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
@NgModule({
  declarations: [
    RessourceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RessourceDetailsPage), 
    SharedDirectivesModule, SharedProvidersModule
  ],
  providers: [InAppBrowser]
})
export class RessourceDetailsPageModule {}
