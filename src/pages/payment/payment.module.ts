import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentPage } from './payment';
import '../../web-components/ck-component';
@NgModule({
  declarations: [
    PaymentPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentPage),
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class PaymentPageModule {}
