
import { NgModule, ErrorHandler} from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { MODULES, MAINPROVIDERS } from './app.imports';
import { SharedDirectivesModule } from './shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { firebaseConfig} from './app.firebaseconfig';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
//import { AngularFireAuthModule } from 'angularfire2/auth';
import { ImageCacheProvider } from '../providers/image-cache/image-cache';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { TooltipsModule } from 'ionic-tooltips';
import { FcmProvider } from '../providers/fcm/fcm';
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
  //  AngularFireAuthModule,
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
  providers: [MAINPROVIDERS, { provide: ErrorHandler, useClass: IonicErrorHandler },
    ImageCacheProvider,
    ImageCacheProvider,
    FcmProvider]
})
export class AppModule {}
