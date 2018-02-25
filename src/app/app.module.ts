
import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MODULES, MAINPROVIDERS } from './app.imports';
import { SharedDirectivesModule } from './shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { firebaseConfig} from './app.firebaseconfig';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

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
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MODULES,
    BrowserAnimationsModule,
    SharedDirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [MAINPROVIDERS, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
