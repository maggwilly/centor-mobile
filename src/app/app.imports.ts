
//shared providers

import { DataService } from '../providers/data-service';
import { AppNotify } from '../providers/app-notify';

//mains providers
import { Push } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// Directives
import { NotificationDirective } from '../directives/notification/notification';
import { HideHeaderDirective } from '../directives/hide-header/hide-header';

// Components
import { DashboordItemComponent } from '../components/dashboord-item/dashboord-item';
import { ProgrammeComponent } from '../components/programme/programme';
import { ShortListComponent } from '../components/short-list/short-list';
import { ResultatListComponent } from '../components/resultat-list/resultat-list';

// Modules

import { IonicStorageModule } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {  CloudModule } from '@ionic/cloud-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { CloudSettings } from '@ionic/cloud-angular';
// Pipes
import { LimitToPipe } from '../pipes/limit-to/limit-to';

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'c3ad15a6'
  },
  'push': {
    'sender_id': '163815809818',
    'pluginConfig': {
      'ios': {
        'badge': true,
        'sound': true
      },
      'android': {
        vibrate: true,
        'sound': true

      }
    }
  }
};

const firebaseConfig = {
  apiKey: "AIzaSyBrbc1Rps9F_s8bJ3ZrWxkYsk5ygoHnp3c",
  authDomain: "trainings-fa73e.firebaseapp.com",
  databaseURL: "https://trainings-fa73e.firebaseio.com",
  projectId: "trainings-fa73e",
  storageBucket: "trainings-fa73e.appspot.com",
  messagingSenderId: "163815809818"
};


export const MODULES = [
  BrowserModule,
  HttpModule,
  
  AngularFireAuthModule,
  AngularFireDatabaseModule,
  CloudModule.forRoot(cloudSettings),
  IonicStorageModule.forRoot(),
  AngularFireModule.initializeApp(firebaseConfig),  
];

export const PIPES = [
  LimitToPipe,
];

export const MAINPROVIDERS = [
  StatusBar,
  SplashScreen,
  Push
];
export const SHAREDPROVIDERS = [
  DataService,
  AppNotify,
];

export const COMPONENTS = [
  DashboordItemComponent,
  ProgrammeComponent,
  ShortListComponent,
  ResultatListComponent
];

export const DIRECTIVES = [
  NotificationDirective,
  HideHeaderDirective,
];
