
//shared providers

import { DataService } from '../providers/data-service';
import { AppNotify } from '../providers/app-notify';
import { GroupsProvider } from '../providers/groups/groups';
import { ImghandlerProvider } from '../providers/imghandler/imghandler';
import { UserProvider } from '../providers/user/user';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { Transfer} from '@ionic-native/transfer';
import { Clipboard } from '@ionic-native/clipboard';
//mains providers
import { Push } from '@ionic-native/push';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';

// Directives
import { NotificationDirective } from '../directives/notification/notification';
import { HideHeaderDirective } from '../directives/hide-header/hide-header';
import { UpdaterDirective} from '../directives/updater/updater';
import { MathJaxDirective } from '../directives/MathJax.directive';
import { HideFabDirective } from '../directives/hide-fab/hide-fab';

// Components
import { DashboordItemComponent } from '../components/dashboord-item/dashboord-item';
import { ProgrammeComponent } from '../components/programme/programme';
import { ShortListComponent } from '../components/short-list/short-list';
import { ResultatListComponent } from '../components/resultat-list/resultat-list';
import { PopupMenuComponent } from '../components/popup-menu/popup-menu';
// Modules

import { IonicStorageModule } from '@ionic/storage';
//import { BrowserModule} from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import {  CloudModule } from '@ionic/cloud-angular';

import { CloudSettings } from '@ionic/cloud-angular';
// Pipes
import { LimitToPipe } from '../pipes/limit-to/limit-to';
import { RelativeTime } from '../pipes/relative-time/relative-time';
const cloudSettings: CloudSettings = {
  core: {
    app_id: 'c3ad15a6'
  },
  push: {
    sender_id: '163815809818',
    pluginConfig: {
      ios: {
        badge: true,
        sound: true
      },
      android: {
        vibrate: true,
        forceShow:true,       
        sound: true

      }
    }
  }
};


export const MODULES = [
 // BrowserModule,
  HttpModule,

  CloudModule.forRoot(cloudSettings),
  IonicStorageModule.forRoot()
];

export const PIPES = [
  LimitToPipe,
  RelativeTime
];

export const MAINPROVIDERS = [
  StatusBar,
  SplashScreen,
  Push,
  DataService,
  AppNotify,
  SocialSharing,
];

export const SHAREDPROVIDERS = [
  GroupsProvider,
  ImghandlerProvider,
  File,
  FileChooser,
  FilePath,
  UserProvider,
  Transfer,
  Clipboard
];

export const COMPONENTS = [
  DashboordItemComponent,
  ProgrammeComponent,
  ShortListComponent,
  ResultatListComponent,
  PopupMenuComponent

];


export const DIRECTIVES = [
  NotificationDirective,
  HideHeaderDirective,
  UpdaterDirective,
  MathJaxDirective,
  HideFabDirective
];
