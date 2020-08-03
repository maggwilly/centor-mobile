import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EcolesPage } from './ecoles';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    EcolesPage,
  ],
  imports: [
    IonicPageModule.forChild(EcolesPage),
    LazyLoadImageModule
  ],
})
export class EcolesPageModule {}
