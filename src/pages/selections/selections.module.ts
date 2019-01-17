import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectionsPage } from './selections';
//import { ConcoursListComponent } from '../../components/concours-list/concours-list';
import { SharedComponentsModule } from '../../app/shared.module';
import { SharedDirectivesModule} from '../../app/shared.module';
@NgModule({
  declarations: [
    SelectionsPage,
    //ConcoursListComponent,
  ],
  imports: [
    IonicPageModule.forChild(SelectionsPage),
    SharedComponentsModule,
    SharedDirectivesModule
  ],
})
export class SelectionsPageModule {}
