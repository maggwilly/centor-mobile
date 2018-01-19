import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleDetailsPage } from './article-details';
import { SharedDirectivesModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    ArticleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticleDetailsPage),
    SharedDirectivesModule
  ],
})
export class ArticleDetailsPageModule {}
