import { SignupModalPage } from './signup-modal';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    SignupModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupModalPage), 
    LazyLoadImageModule
  ],
  exports: [
    SignupModalPage
  ]
})

export class SignupModalPageModule { }
