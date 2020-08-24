import { Component, NgZone } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Events, ModalController, Platform, Nav, MenuController, LoadingController, AlertController, ActionSheetController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataService } from '../providers/data-service';
import { AngularFireDatabase } from 'angularfire2/database';
import { Storage } from '@ionic/storage';
import firebase from 'firebase';
import { AppNotify } from '../providers/app-notify';
import { FcmProvider } from '../providers/fcm/fcm';
import { Deeplinks } from '@ionic-native/deeplinks';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import 'rxjs/add/operator/take';
import {AbonnementProvider} from "../providers/abonnement/abonnement";
import {ImghandlerProvider} from "../providers/imghandler/imghandler";
import {UserProvider} from "../providers/user/user";
//import { Push, PushObject, PushOptions, NotificationEventResponse, RegistrationEventResponse } from '@ionic-native/push';


const appVersion ='3.3.0';

export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  logsOut?: boolean;
  index?: number;
}
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = (!document.URL.startsWith('http') ||
    this.platform.is('core') ||
    this.platform.is('mobileweb')) ? 'ProcessingPage' : 'HomePage';//TabsPage;TutorialPage;// MatieresPage;//
  authInfo: any;
  concours: any;
  paidConcours: any[];
  preference: any = {};
  _concours: any[];
  user: any;
  zone: NgZone;
  mode = 'prod';
  defaultAvatar = 'assets/images/default-avatar.jpg';
  offset = 100;
  registrationId;
  modalshow=false;
  rootSet:boolean=false;
  telegram: any='https://t.me/centorconcours';
  notificationId: string=firebase.auth().currentUser ? firebase.auth().currentUser.uid : undefined;//= window.localStorage.getItem('registrationId');
  appPages: PageInterface[] = [
    { title: 'Accueil', component: 'HomePage', icon: 'home' },
    { title: 'Les Concours', component: 'ConcoursPage', icon: 'school' },
    { title: 'Arrêtés publiés', component: 'ResultatsPage', icon: 'md-list' },
    { title: 'A Propos de nous', component: 'AboutPage', icon: 'information-circle' }
  ];
  skipMsg: string = "Skip";
  state: string = 'x';
  abonnement: any;
  currentMessage = new BehaviorSubject(null)
  constructor(public platform: Platform,
    public menu: MenuController,
    public dataService: DataService,
    public abonnementProvider:AbonnementProvider,
    public notify: AppNotify,
    private fcm: FcmProvider,
    public af: AngularFireDatabase,
    public storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public events: Events,
     public userProvider: UserProvider,
     public imgservice: ImghandlerProvider,
    private deeplinks: Deeplinks
  ) {
    this.zone = new NgZone({});
    platform.ready().then(() => {

      this.storage.get('registrationId').then((data)=>{
        this.registrationId = data;
      })
      this.statusBar.backgroundColorByHexString("#065C79");
    //
      this.listenProfilEvents();
      try{
        this.registerForNotification();
        //this.registerForNotificationWeb();
      }catch (e) {
        console.log(e);
      }finally {
        this.startApp();
        this.splashScreen.hide();
      }

    });

  }
  listenProfilEvents(){
    this.events.subscribe('logged:in',()=>{
      this.storage.get('registrationId').then(token =>{
        this.userProvider.addToken(token);
      })

    })

    this.events.subscribe('picture:change',imageData =>{
      this.imgservice.storeImage(imageData, '/profileimages').then(url => {
        this.user.info.photoURL=url;
        this.events.publish('picture:changed',url);
        if(!url)
          return
        this.userProvider.updateimage(url).then((res: any) => { })
      })
    })

   this.events.subscribe('displayName:change',displayname =>{
     this.user.info.displayName=displayname;
    this.userProvider.updatedisplayname(displayname);
  })
 }


  animationDone() {
    this.state = 'x';
  }

  getAbonnement() {
    this.abonnementProvider.checkAbonnementValidity( 0).then(data => {
      this.abonnement = data;
    }, error => {
      this.notify.onError({ message: 'Petit problème de connexion.' });
    });
  }

  isExpired(abonnement: any) {
    if (abonnement == null)
      return true;
    let now = Date.now();
    let endDate = new Date(abonnement.endDate).getTime();
    return now > endDate;
  }


  startApp() {
    if(this.rootSet)
        return;
	   this.observeAuth();
    this.storage.get('read-tutorial-centor').then(data=>{
      if (!data) {
        const modal = this.modalCtrl.create('TutorialPage');
        modal.onDidDismiss(data => {
            this.storage.set('read-tutorial-centor', true)
        });
        modal.present();
      }
    },error=>{
      this.notify.onError({ message: JSON.stringify(error) });
    })

    if (!document.URL.startsWith('http') || this.platform.is('core') || this.platform.is('mobileweb'))
    this.storage.get('_preferences')
      .then((data) => {
        this.concours = data;
        if (this.concours)
          this.showDetails(this.concours);
        else
          this.nav.setRoot('HomePage');
      }, error=>{
        this.nav.setRoot('HomePage');
      });
      else
        this.nav.setRoot('HomePage');

  }


  openMessages() {
    // navigate to the new page if it is not the current page
    this.nav.setRoot('NotificationsPage');
    this.menu.close();
  }




  getUserProfile() {
    this.getAbonnement();
    return this.storage.get(firebase.auth().currentUser.uid).then((info) => {
      this.user.info = info ? info : firebase.auth().currentUser;
      this.defaultAvatar = info ? info.photoURL : firebase.auth().currentUser.photoURL;
      return this.dataService.getInfo(firebase.auth().currentUser.uid, this.registrationId).then((info) => {
        if (info) {
          info.photoURL=firebase.auth().currentUser.photoURL
          this.user.info = info;
          this.defaultAvatar = firebase.auth().currentUser.photoURL;
          this.storage.set(firebase.auth().currentUser.uid, info);
             if (!info.phone || !info.displayName)
                this.openModal('SignupModalPage', {info:info});
          }
        },
        error => {
          this.notify.onError({ message: 'Petit problème de connexion.' });
        })
    })

  }


checkInfo(info:any){
  if(!info){
    this.dataService.getInfoObservable(this.authInfo.uid, this.registrationId).subscribe(data => {
      this.user.info = data.json();
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    });
  }

}


  openModal(pageName, arg?: any) {
    if (this.modalshow)
       return
      this.modalshow=true;
      this.modalCtrl.create(pageName, arg, { cssClass: 'inset-modal' })
      .present();
  }




  openSettingPage() {
    this.menu.close();
    let modal = this.modalCtrl.create('LoginSliderPage', {redirectTo: true});
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      this.zone.run(() => {
        if (user) {
           modal.dismiss(user);
           this.events.publish("logged:in")
             this.nav.push('SettingPage', { authInfo: firebase.auth().currentUser });
          unsubscribe();
          return;
        }
        unsubscribe();
         modal.onDidDismiss((data, role) => {
          if (data) {
            this.nav.setRoot('HomePage');;
          }else{
            this.user = undefined;
            this.paidConcours = [];
          }
        })
        modal.present();
      });
    })

  }

  openPage(page: PageInterface, navParams: any = null, root = false, ) {
    this.menu.close();
    if (root)
      this.nav.setRoot(page.component, navParams);
    this.nav.push(page.component, navParams);
  }

  registerForNotification() {
    this.observeAuth();
    if (this.platform.is('android')) {
      this.fcm.getToken().then(token => {
         this.registration(token);
      });
      this.fcm.onTokenRefresh().subscribe(token => {
        this.registration(token);
      });
     this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        if (data.page) {
           this.rootSet = true;
          switch (data.page) {
          case 'resultat':
              this.nav.setRoot('ResultatsPage', { showMenu: true });
            break;
            case 'rappel':
              this.nav.setRoot('NotificationsPage', { showMenu: true });
              break;
            case 'document':
              this.nav.setRoot('RessourceDetailsPage', { ressource_id: data.id, showMenu: true});
              break;
            case 'concours':
              this.nav.setRoot('ConcoursOptionsPage', { id: data.id, showMenu: true});
              break;
            case 'notification':
              this.nav.setRoot('ArticleDetailsPage', { notification_id: data.id, showMenu: true });
              break;
            case 'chat':
              this.nav.setRoot('GroupchatPage', { groupName: data.id, showMenu: true});
              break;
          default:
              this.nav.setRoot('HomePage');
            break;
        }
        }
      }else {
        if (!data.body)
          return
        let alert = this.notify.onInfo({ message: '' + data.title.substring(0, 30) +' ... '+data.body.substring(0, 50)+''});
        alert.present();
      };
    });
      this.fcm.listenTopic('centor-public');
    }

  }
  ngAfterViewInitr() {
    this.deeplinks.routeWithNavController(this.nav, {
      '/resultat': 'ResultatsPage',
      '/document/:ressource_id': 'RessourceDetailsPage',
      '/concours/:id': 'ConcoursOptionsPage',
      '/notification/:notification_id': 'ArticleDetailsPage'
    }).subscribe((match) => {
    }, (nomatch) => {
      console.error('Got a deeplink that didn\'t match', nomatch);
    });
  }

  registerForNotificationWeb() {
    this.observeAuth();
   firebase.messaging().requestPermission()
      .then(() => {
        return firebase.messaging().getToken().then(token => {
          this.registration(token);
        }, error => {
          console.log(error);

        })
      }, error => {
       console.log(error);

      })

    firebase.messaging().onMessage((payload) => {
      console.log("Message received. ", payload);
        this.currentMessage.next(payload)
    });

  }

  registration(registrationId: any) {
    this.registrationId = registrationId;
    this.storage.set('registrationId', registrationId).then(()=>{
      this.dataService.addRegistration(registrationId, { registrationId: registrationId ,appVersion: appVersion }).then((data) => {
      }, error => {
        this.notify.onError({message:'problème de connexion.'});
      })
    },error=>{
      this.dataService.addRegistration(registrationId, { registrationId: registrationId, appVersion: appVersion }).then((data) => {
      }, error => {
        this.notify.onError({message:'problème de connexion.'});
      })
    });

  }



  loadAbonnement() {
    this.storage.get('_abonnements').then((dtata)=>{
      this.paidConcours = dtata ? dtata : [];
    this.abonnementProvider.getAbonnementsObservable().subscribe((data:any[]) => {
      this.paidConcours = data ? data : [];
      this.storage.set('_abonnements', data);
    }, error => {
      this.notify.onError({ message: 'Problème de connexion.' });
    })
    })
  }

  observeAuth() {
    this.notificationId = firebase.auth().currentUser ? firebase.auth().currentUser.uid : undefined;
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authInfo = user;
        this.fcm.setUserId(user.uid);
        this.user = { info: user};
        this.notificationId = user.uid;
        this.zone.run(() => {
          this.getUserProfile().then(()=>{
           this.loadAbonnement();
          });
        })
      } else {
        this.user = undefined;
        this.paidConcours = [];
      }
    });
    this.events.subscribe('payement:success', (data) => {
      this.zone.run(() => {
        this.loadAbonnement();

      });
    });

    this.events.subscribe('profil:updated', (data) => {
      this.zone.run(() => {
        this.user = { info: data };
      });
    });
  }




  showDetails(abonnement: any) {
    this.nav.setRoot('MatieresPage', { abonnement: abonnement });
    this.storage.set('_preferences', abonnement).catch(error => { });
    this.menu.close();
  }

}


