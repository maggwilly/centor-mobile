
import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MODULES, MAINPROVIDERS , SHAREDPROVIDERS} from './app.imports';
import { SharedDirectivesModule } from './shared.module';
@NgModule({
  declarations: [
    MyApp,
  ],

  imports: [
    IonicModule.forRoot(MyApp,{
      iconMode: 'ios',
      modalEnter: 'modal-slide-in',
      modalLeave: 'modal-slide-out',
      tabsPlacement: 'bottom',
     // backButtonText: 'Quitter',
      pageTransition: 'ios-transition'
    }),
    MODULES,
    SharedDirectivesModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [MAINPROVIDERS, SHAREDPROVIDERS, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
