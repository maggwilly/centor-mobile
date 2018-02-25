import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfileCandidatPage } from './edit-profile-candidat';
import { Camera } from '@ionic-native/camera';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { UserProvider } from '../../providers/user/user';
@NgModule({
  declarations: [
    EditProfileCandidatPage,
  ],
  imports: [
    IonicPageModule.forChild(EditProfileCandidatPage),
  ],
  providers: [Camera, InAppBrowser, UserProvider]
})
export class EditProfileCandidatPageModule {}
