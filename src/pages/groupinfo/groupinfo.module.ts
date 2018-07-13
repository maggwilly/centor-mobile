import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupinfoPage } from './groupinfo';
import { SharedProvidersModule } from '../../app/shared.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
@NgModule({
  declarations: [
    GroupinfoPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupinfoPage),
    SharedProvidersModule,
    LazyLoadImageModule
  ],
  exports: [
    GroupinfoPage
  ]
})
export class GroupinfoPageModule {}
