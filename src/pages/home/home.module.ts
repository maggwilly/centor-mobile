import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { SharedComponentsModule } from '../../app/shared.module';
import { SharedDirectivesModule } from '../../app/shared.module';
import { CarouselComponent } from '../../components/carousel/carousel';
import { SharedProvidersModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    HomePage,
    CarouselComponent
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    SharedComponentsModule,
    SharedDirectivesModule,
    SharedProvidersModule

  ],
})
export class HomePageModule {}
