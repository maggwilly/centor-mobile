import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConcoursPage } from './concours';
import { ConcoursListComponent } from '../../components/concours-list/concours-list';
import { SharedDirectivesModule} from '../../app/shared.module';
import { SharedComponentsModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    ConcoursPage, 
    ConcoursListComponent,
  ],
  imports: [
    IonicPageModule.forChild(ConcoursPage),
    SharedDirectivesModule,
    SharedComponentsModule
  ],
  entryComponents: [ConcoursListComponent],
})
export class ConcoursPageModule {}
