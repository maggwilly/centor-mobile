
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
import { Camera } from '@ionic-native/camera';
//mains providers
import { Deeplinks } from '@ionic-native/deeplinks';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SocialSharing } from '@ionic-native/social-sharing';

import { FCM  as Firebase} from '@ionic-native/fcm'
// Directives
import { NotificationDirective } from '../directives/notification/notification';
import { HideHeaderDirective } from '../directives/hide-header/hide-header';
import { UpdaterDirective} from '../directives/updater/updater';
import { AvalabilityDirective } from '../directives/avalability/avalability';
import { MathJaxDirective } from '../directives/MathJax.directive';
import { HideFabDirective } from '../directives/hide-fab/hide-fab';
import { ImageCacheDirective } from '../directives/image-cache/image-cache';
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
import { ConcoursListComponent } from '../components/concours-list/concours-list';
import {GroupmanagerProvider} from "../providers/groupmanager/groupmanager";
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
        iconColor: "#00AEED",
        vibrate: true,
        forceShow:true,
        sound: true,
        icon: 'ic_notify'
      }
    }
  }
};


export const MODULES = [
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
  Firebase,
  Deeplinks,
  DataService,
  AppNotify,
  SocialSharing,
];

export const SHAREDPROVIDERS = [
  Camera,
   GroupsProvider,
  GroupmanagerProvider,
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
  ConcoursListComponent,
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
  HideFabDirective,
  AvalabilityDirective,
  ImageCacheDirective
];
