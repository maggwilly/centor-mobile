import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleDetailsPage } from './article-details';
import { SharedDirectivesModule } from '../../app/shared.module';
import { Ionic2RatingModule } from 'ionic2-rating';
@NgModule({
  declarations: [
    ArticleDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ArticleDetailsPage),
    SharedDirectivesModule,
    Ionic2RatingModule
  ],
})
export class ArticleDetailsPageModule {}
