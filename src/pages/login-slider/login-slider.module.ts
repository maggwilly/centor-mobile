import { LoginSliderPage } from './login-slider';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook'
@NgModule({
  declarations: [
    LoginSliderPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginSliderPage),
  ],
  exports: [
    LoginSliderPage
  ],
  providers: [Facebook]
})

export class LoginSliderPageModule { }
