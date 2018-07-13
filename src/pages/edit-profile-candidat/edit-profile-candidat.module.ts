import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfileCandidatPage } from './edit-profile-candidat';
import { SharedProvidersModule } from '../../app/shared.module';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    EditProfileCandidatPage,
    
  ],
  imports: [
    IonicPageModule.forChild(EditProfileCandidatPage), SharedProvidersModule, LazyLoadImageModule
  ],
  providers: [InAppBrowser]
})
export class EditProfileCandidatPageModule {}
