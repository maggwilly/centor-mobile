import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticlesPage } from './articles';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    ArticlesPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticlesPage),
    SharedDirectivesModule
  ],
})
export class ArticlesPageModule {}
