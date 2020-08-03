import { NgModule } from '@angular/core';
import { AccordionListPage } from './accordion-list';
import { IonicPageModule } from 'ionic-angular';
import { AccordionListComponent } from '../../components/accordion-list/accordion-list';
@NgModule({
  declarations: [
    AccordionListPage,
    AccordionListComponent
  ],
  imports: [
    IonicPageModule.forChild(AccordionListPage),
  ],
  exports: [
    AccordionListPage
  ]
})

export class AccordionListPageModule { }
