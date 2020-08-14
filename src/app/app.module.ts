import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {MODULES, MAINPROVIDERS, SHAREDPROVIDERS} from './app.imports';
import { SharedDirectivesModule } from './shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TooltipsModule } from 'ionic-tooltips';
import { FcmProvider } from '../providers/fcm/fcm';
import { AbonnementProvider } from '../providers/abonnement/abonnement';
import { firebaseConfig} from './app.firebaseconfig';
import { GroupmanagerProvider } from '../providers/groupmanager/groupmanager';


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
     //backButtonText: 'Quitter',
      pageTransition: 'ios-transition'
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    MODULES,
    BrowserAnimationsModule,
    LazyLoadImageModule,
    TooltipsModule,
    SharedDirectivesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [MAINPROVIDERS,SHAREDPROVIDERS,{ provide: ErrorHandler, useClass: IonicErrorHandler },
    FcmProvider,
    AbonnementProvider,
    GroupmanagerProvider]
})
export class AppModule {}
