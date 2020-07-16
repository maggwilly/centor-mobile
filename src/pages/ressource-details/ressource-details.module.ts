import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RessourceDetailsPage } from './ressource-details';
import { SharedDirectivesModule } from '../../app/shared.module';
import { SharedProvidersModule } from '../../app/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@NgModule({
  declarations: [
    RessourceDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(RessourceDetailsPage),
    SharedDirectivesModule, SharedProvidersModule, PdfViewerModule
  ],
  providers: [InAppBrowser]
})
export class RessourceDetailsPageModule {}
